import Allocation from "../models/Allocation.js";
import Booking from "../models/Booking.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import AuditCycle from "../models/AuditCycle.js";
import AuditItem from "../models/AuditItem.js";
import { sendCreated, sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as workflow from "../services/workflowService.js";

export const allocate = asyncHandler(async (req, res) => sendCreated(res, await workflow.allocateAsset(req.body, req.user), "Asset allocated"));
export const returnAllocation = asyncHandler(async (req, res) => sendSuccess(res, await workflow.returnAsset(req.params.id, req.body), "Asset returned"));
export const listAllocations = asyncHandler(async (_req, res) => sendSuccess(res, await Allocation.find().populate("asset allocatedToUser allocatedToDepartment", "name assetTag email code"), "Allocations fetched"));
export const approveTransfer = asyncHandler(async (req, res) => sendSuccess(res, await workflow.approveTransfer(req.params.id, req.user), "Transfer approved"));
export const completeTransfer = asyncHandler(async (req, res) => sendSuccess(res, await workflow.completeTransfer(req.params.id, req.user), "Transfer completed"));

export const bookResource = asyncHandler(async (req, res) => sendCreated(res, await workflow.createBooking(req.body, req.user), "Resource booked"));
export const listBookings = asyncHandler(async (_req, res) => sendSuccess(res, await Booking.find().populate("resource bookedBy", "name assetTag email").sort("startAt"), "Bookings fetched"));
export const cancelBooking = asyncHandler(async (req, res) => sendSuccess(res, await Booking.findByIdAndUpdate(req.params.id, { status: "Cancelled" }, { new: true }), "Booking cancelled"));

export const requestMaintenance = asyncHandler(async (req, res) => sendCreated(res, await workflow.createMaintenance(req.body, req.user), "Maintenance requested"));
export const updateMaintenance = asyncHandler(async (req, res) => sendSuccess(res, await workflow.updateMaintenanceStatus(req.params.id, req.body, req.user), "Maintenance updated"));
export const resolveMaintenance = asyncHandler(async (req, res) => sendSuccess(res, await workflow.resolveMaintenance(req.params.id, req.body), "Maintenance resolved"));
export const listMaintenance = asyncHandler(async (_req, res) => sendSuccess(res, await MaintenanceRequest.find().populate("asset requestedBy technician", "name assetTag email"), "Maintenance fetched"));

export const createAudit = asyncHandler(async (req, res) => sendCreated(res, await AuditCycle.create({ ...req.body, assignedAuditors: req.body.assignedAuditors || (req.body.assignedAuditor ? [req.body.assignedAuditor] : []) }), "Audit cycle created"));
export const verifyAudit = asyncHandler(async (req, res) => sendCreated(res, await workflow.verifyAuditItem(req.body, req.user), "Audit item verified"));
export const closeAudit = asyncHandler(async (req, res) => sendSuccess(res, await workflow.closeAudit(req.params.id), "Audit closed and locked"));
export const listAudits = asyncHandler(async (_req, res) => sendSuccess(res, await AuditCycle.find().populate("assignedAuditor assignedAuditors", "name email"), "Audits fetched"));
export const listAuditItems = asyncHandler(async (req, res) => sendSuccess(res, await AuditItem.find({ auditCycle: req.params.id }).populate("asset verifiedBy", "name assetTag email"), "Audit items fetched"));
