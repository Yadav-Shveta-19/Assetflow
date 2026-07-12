import { Router } from "express";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import orgRoutes from "./orgRoutes.js";
import assetRoutes from "./assetRoutes.js";
import workflowRoutes from "./workflowRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import reportRoutes from "./reportRoutes.js";
import searchRoutes from "./searchRoutes.js";
import activityRoutes from "./activityRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/organization", orgRoutes);
router.use("/assets", assetRoutes);
router.use("/workflows", workflowRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);
router.use("/search", searchRoutes);
router.use("/activity-logs", activityRoutes);

export default router;
