import Asset from "../models/Asset.js";
import Allocation from "../models/Allocation.js";
import Booking from "../models/Booking.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import AuditCycle from "../models/AuditCycle.js";
import AuditItem from "../models/AuditItem.js";
import Notification from "../models/Notification.js";
import TransferRequest from "../models/TransferRequest.js";
import { AppError } from "../utils/AppError.js";
import { ensureAllocatable } from "./assetService.js";

export const allocateAsset = async (payload, user) => {
  if (!payload.allocatedToUser && !payload.allocatedToDepartment) throw new AppError("Allocate to a user or department", 422);
  const asset = await ensureAllocatable(payload.asset);
  const allocation = await Allocation.create({
    ...payload,
    allocatedBy: user._id,
    expectedReturnDate: payload.expectedReturnDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  asset.status = "Allocated";
  asset.currentHolder = payload.allocatedToUser;
  asset.department = payload.allocatedToDepartment || asset.department;
  await asset.save();
  await Notification.create({ user: payload.allocatedToUser || user._id, title: "Asset assigned", message: `${asset.assetTag} has been allocated`, type: "Asset Assigned", module: "Allocation", entityId: allocation._id });
  return allocation;
};

export const approveTransfer = async (transferId, user) => {
  const transfer = await TransferRequest.findById(transferId);
  if (!transfer || transfer.status !== "Requested") throw new AppError("Requested transfer not found", 404);
  transfer.status = "Approved";
  transfer.approvedBy = user._id;
  await transfer.save();
  if (transfer.toUser) {
    await Notification.create({ user: transfer.toUser, title: "Transfer approved", message: "An asset transfer was approved", type: "Transfer Approved", module: "Transfer", entityId: transfer._id });
  }
  return transfer;
};

export const completeTransfer = async (transferId, user) => {
  const transfer = await TransferRequest.findById(transferId);
  if (!transfer || transfer.status !== "Approved") throw new AppError("Approved transfer not found", 404);
  await Allocation.updateMany({ asset: transfer.asset, status: "Active" }, { status: "Transferred", actualReturnDate: new Date() });
  await Allocation.create({
    asset: transfer.asset,
    allocatedToUser: transfer.toUser,
    allocatedToDepartment: transfer.toDepartment,
    allocatedBy: user._id,
    expectedReturnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    notes: `Transfer request ${transfer._id}`
  });
  await Asset.findByIdAndUpdate(transfer.asset, { status: "Allocated", currentHolder: transfer.toUser, department: transfer.toDepartment });
  transfer.status = "Completed";
  transfer.completedAt = new Date();
  await transfer.save();
  return transfer;
};

export const returnAsset = async (allocationId, payload) => {
  const allocation = await Allocation.findById(allocationId);
  if (!allocation || allocation.status !== "Active") throw new AppError("Active allocation not found", 404);
  allocation.status = "Returned";
  allocation.actualReturnDate = new Date();
  allocation.conditionOnReturn = payload.conditionOnReturn;
  allocation.notes = payload.notes;
  await allocation.save();
  await Asset.findByIdAndUpdate(allocation.asset, { status: "Available", currentHolder: null });
  return allocation;
};

export const createBooking = async (payload, user) => {
  if (new Date(payload.endAt) <= new Date(payload.startAt)) throw new AppError("Booking end time must be after start time", 422);
  const resource = await Asset.findOne({ _id: payload.resource, sharedResource: true });
  if (!resource) throw new AppError("Shared resource not found", 404);
  const overlap = await Booking.findOne({
    resource: payload.resource,
    status: { $in: ["Upcoming", "Ongoing"] },
    startAt: { $lt: payload.endAt },
    endAt: { $gt: payload.startAt }
  });
  if (overlap) throw new AppError("Resource booking overlaps with an existing booking", 409);
  return Booking.create({ ...payload, bookedBy: user._id });
};

export const createMaintenance = async (payload, user) => {
  return MaintenanceRequest.create({ ...payload, requestedBy: user._id, status: "Pending" });
};

export const updateMaintenanceStatus = async (id, payload, user) => {
  const request = await MaintenanceRequest.findById(id);
  if (!request) throw new AppError("Maintenance request not found", 404);
  const allowed = ["Approved", "Rejected", "Technician Assigned", "In Progress"];
  if (!allowed.includes(payload.status)) throw new AppError("Unsupported maintenance transition", 422);
  request.status = payload.status;
  request.approvedBy = ["Approved", "Rejected"].includes(payload.status) ? user._id : request.approvedBy;
  request.technician = payload.technician || request.technician;
  request.resolutionNotes = payload.notes || request.resolutionNotes;
  await request.save();
  if (payload.status === "Approved") await Asset.findByIdAndUpdate(request.asset, { status: "Under Maintenance" });
  await Notification.create({ user: request.requestedBy, title: `Maintenance ${payload.status}`, message: `Your maintenance request was ${payload.status.toLowerCase()}`, type: `Maintenance ${payload.status}`, module: "Maintenance", entityId: request._id });
  return request;
};

export const resolveMaintenance = async (id, payload) => {
  const request = await MaintenanceRequest.findById(id);
  if (!request) throw new AppError("Maintenance request not found", 404);
  request.status = "Resolved";
  request.resolutionNotes = payload.resolutionNotes;
  request.resolvedAt = new Date();
  await request.save();
  await Asset.findByIdAndUpdate(request.asset, { status: "Available" });
  return request;
};

export const verifyAuditItem = async (payload, user) => {
  const cycle = await AuditCycle.findById(payload.auditCycle);
  if (!cycle || !["Active", "Draft"].includes(cycle.status)) throw new AppError("Audit cycle is not open", 409);
  const item = await AuditItem.create({ ...payload, verifiedBy: user._id, verifiedAt: new Date() });
  return item;
};

export const closeAudit = async (auditId) => {
  const cycle = await AuditCycle.findById(auditId);
  if (!cycle || cycle.status === "Locked") throw new AppError("Open audit cycle not found", 404);
  const flaggedItems = await AuditItem.find({ auditCycle: auditId, status: { $in: ["Missing", "Damaged"] } });
  await Promise.all(flaggedItems.map((item) => (item.status === "Missing" ? Asset.findByIdAndUpdate(item.asset, { status: "Lost" }) : Promise.resolve())));
  cycle.status = "Locked";
  cycle.closedAt = new Date();
  cycle.lockedAt = new Date();
  cycle.discrepancySummary = `${flaggedItems.length} discrepancy item(s): ${flaggedItems.map((item) => `${item.asset}:${item.status}`).join(", ")}`;
  await cycle.save();
  return { cycle, flaggedItems };
};
