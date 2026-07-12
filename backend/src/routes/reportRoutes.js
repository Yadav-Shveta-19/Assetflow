import { Router } from "express";
import Asset from "../models/Asset.js";
import Allocation from "../models/Allocation.js";
import Booking from "../models/Booking.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import AuditItem from "../models/AuditItem.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

const router = Router();
router.use(authenticate, authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD));

router.get("/summary", asyncHandler(async (_req, res) => {
  const [assetsByStatus, allocations, bookings, maintenance, auditDiscrepancies] = await Promise.all([
    Asset.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, value: { $sum: "$acquisitionCost" } } }]),
    Allocation.countDocuments(),
    Booking.countDocuments(),
    MaintenanceRequest.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
    AuditItem.countDocuments({ status: { $in: ["Missing", "Damaged"] } })
  ]);
  sendSuccess(res, { assetsByStatus, allocations, bookings, maintenance, auditDiscrepancies }, "Report generated");
}));

router.get("/export.csv", asyncHandler(async (_req, res) => {
  const assets = await Asset.find().populate("category department", "name code");
  const rows = ["assetTag,name,status,serialNumber,location"];
  assets.forEach((asset) => rows.push([asset.assetTag, asset.name, asset.status, asset.serialNumber, asset.location].map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(",")));
  res.header("Content-Type", "text/csv").attachment("assetflow-assets.csv").send(rows.join("\n"));
}));

export default router;
