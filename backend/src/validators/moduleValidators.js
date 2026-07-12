import { body } from "express-validator";

export const assetValidator = [
  body("name").trim().isLength({ min: 2 }),
  body("serialNumber").trim().notEmpty(),
  body("category").isMongoId(),
  body("acquisitionCost").optional().isFloat({ min: 0 })
];

export const departmentValidator = [body("name").trim().isLength({ min: 2 }), body("code").trim().isLength({ min: 2 })];
export const categoryValidator = [body("name").trim().isLength({ min: 2 }), body("warrantyPeriodMonths").optional().isInt({ min: 0 })];
export const allocationValidator = [body("asset").isMongoId(), body("expectedReturnDate").optional().isISO8601()];
export const bookingValidator = [body("resource").isMongoId(), body("title").trim().notEmpty(), body("startAt").isISO8601(), body("endAt").isISO8601()];
export const maintenanceValidator = [body("asset").isMongoId(), body("description").trim().isLength({ min: 5 }), body("priority").optional().isIn(["Low", "Medium", "High", "Critical"])];
export const auditValidator = [body("name").trim().isLength({ min: 2 }), body("assignedAuditor").optional().isMongoId(), body("assignedAuditors").optional().isArray(), body("startDate").isISO8601(), body("endDate").isISO8601()];
export const auditItemValidator = [body("auditCycle").isMongoId(), body("asset").isMongoId(), body("status").isIn(["Missing", "Damaged", "Verified"])];
