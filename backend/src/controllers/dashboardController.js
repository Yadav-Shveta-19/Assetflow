import Asset from "../models/Asset.js";
import Allocation from "../models/Allocation.js";
import Booking from "../models/Booking.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import TransferRequest from "../models/TransferRequest.js";
import AuditCycle from "../models/AuditCycle.js";
import ActivityLog from "../models/ActivityLog.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const dashboard = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const [assetsAvailable, assetsAllocated, maintenanceToday, pendingMaintenance, activeBookings, pendingTransfers, upcomingReturns, overdueReturns, auditProgress, recentActivities, notifications, assetDistribution] = await Promise.all([
    Asset.countDocuments({ status: "Available" }),
    Asset.countDocuments({ status: "Allocated" }),
    MaintenanceRequest.countDocuments({ createdAt: { $gte: todayStart, $lt: todayEnd } }),
    MaintenanceRequest.countDocuments({ status: { $in: ["Pending", "Approved", "Technician Assigned", "In Progress"] } }),
    Booking.countDocuments({ status: { $in: ["Upcoming", "Ongoing"] } }),
    TransferRequest.countDocuments({ status: "Requested" }),
    Allocation.countDocuments({ status: "Active", expectedReturnDate: { $gte: new Date(), $lte: nextWeek } }),
    Allocation.countDocuments({ status: "Active", expectedReturnDate: { $lt: new Date() } }),
    AuditCycle.countDocuments({ status: "Active" }),
    ActivityLog.find().sort("-createdAt").limit(8).populate("user", "name email"),
    Notification.find({ user: req.user._id }).sort("-createdAt").limit(8),
    Asset.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
  ]);
  sendSuccess(res, {
    kpis: { assetsAvailable, assetsAllocated, maintenanceToday, pendingMaintenance, activeBookings, pendingTransfers, upcomingReturns, overdueReturns, auditProgress },
    recentActivities,
    notifications,
    charts: { assetDistribution }
  });
});
