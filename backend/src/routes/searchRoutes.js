import { Router } from "express";
import Asset from "../models/Asset.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import { authenticate } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

const router = Router();
router.get("/", authenticate, asyncHandler(async (req, res) => {
  const q = new RegExp(req.query.q || "", "i");
  const [assets, employees, departments] = await Promise.all([
    Asset.find({ $or: [{ name: q }, { assetTag: q }, { serialNumber: q }] }).limit(10),
    User.find({ $or: [{ name: q }, { email: q }] }).select("-password").limit(10),
    Department.find({ $or: [{ name: q }, { code: q }] }).limit(10)
  ]);
  sendSuccess(res, { assets, employees, departments }, "Search completed");
}));

export default router;
