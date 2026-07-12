import { Router } from "express";
import Notification from "../models/Notification.js";
import { authenticate } from "../middlewares/auth.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(authenticate);
router.get("/", asyncHandler(async (req, res) => sendSuccess(res, await Notification.find({ user: req.user._id }).sort("-createdAt"), "Notifications fetched")));
router.patch("/read-all", asyncHandler(async (req, res) => sendSuccess(res, await Notification.updateMany({ user: req.user._id, readAt: null }, { readAt: new Date() }), "Notifications marked as read")));
router.patch("/:id/read", asyncHandler(async (req, res) => sendSuccess(res, await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { readAt: new Date() }, { new: true }), "Notification marked as read")));
export default router;
