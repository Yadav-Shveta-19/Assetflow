import { Router } from "express";
import * as workflow from "../controllers/workflowController.js";
import TransferRequest from "../models/TransferRequest.js";
import { crudController } from "../controllers/crudController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/errorHandler.js";
import { ROLES } from "../constants/roles.js";
import { allocationValidator, auditItemValidator, auditValidator, bookingValidator, maintenanceValidator } from "../validators/moduleValidators.js";

const router = Router();
const transfers = crudController(TransferRequest, ["reason", "status"]);

router.use(authenticate);
router.get("/allocations", workflow.listAllocations);
router.post("/allocations", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), allocationValidator, validateRequest, workflow.allocate);
router.patch("/allocations/:id/return", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD), workflow.returnAllocation);

router.get("/transfers", transfers.list);
router.post("/transfers", transfers.create);
router.patch("/transfers/:id", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), transfers.update);
router.patch("/transfers/:id/approve", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD), workflow.approveTransfer);
router.patch("/transfers/:id/complete", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), workflow.completeTransfer);

router.get("/bookings", workflow.listBookings);
router.post("/bookings", bookingValidator, validateRequest, workflow.bookResource);
router.patch("/bookings/:id/cancel", workflow.cancelBooking);

router.get("/maintenance", workflow.listMaintenance);
router.post("/maintenance", maintenanceValidator, validateRequest, workflow.requestMaintenance);
router.patch("/maintenance/:id/status", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), workflow.updateMaintenance);
router.patch("/maintenance/:id/resolve", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), workflow.resolveMaintenance);

router.get("/audits", workflow.listAudits);
router.post("/audits", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), auditValidator, validateRequest, workflow.createAudit);
router.patch("/audits/:id/close", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), workflow.closeAudit);
router.get("/audits/:id/items", workflow.listAuditItems);
router.post("/audits/items", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD), auditItemValidator, validateRequest, workflow.verifyAudit);

export default router;
