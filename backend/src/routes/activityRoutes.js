import { Router } from "express";
import ActivityLog from "../models/ActivityLog.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { ROLES } from "../constants/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

const router = Router();

router.get("/", authenticate, authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD), asyncHandler(async (_req, res) => {
  const logs = await ActivityLog.find().populate("user", "name email role").sort("-createdAt").limit(200);
  sendSuccess(res, logs, "Activity logs fetched");
}));

export default router;
