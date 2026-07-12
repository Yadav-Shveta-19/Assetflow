import { Router } from "express";
import User from "../models/User.js";
import Department from "../models/Department.js";
import AssetCategory from "../models/AssetCategory.js";
import { crudController } from "../controllers/crudController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/errorHandler.js";
import { ROLES } from "../constants/roles.js";
import { categoryValidator, departmentValidator } from "../validators/moduleValidators.js";

const router = Router();
const departments = crudController(Department, ["name", "code", "location"]);
const categories = crudController(AssetCategory, ["name"]);
const employees = crudController(User, ["name", "email", "designation"]);
const adminOnly = authorize(ROLES.ADMIN);

router.use(authenticate);
router.get("/departments", departments.list);
router.post("/departments", adminOnly, departmentValidator, validateRequest, departments.create);
router.get("/departments/:id", departments.get);
router.patch("/departments/:id", adminOnly, departments.update);
router.delete("/departments/:id", adminOnly, departments.remove);

router.get("/categories", categories.list);
router.post("/categories", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), categoryValidator, validateRequest, categories.create);
router.patch("/categories/:id", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), categories.update);
router.delete("/categories/:id", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), categories.remove);

router.get("/employees", authorize(ROLES.ADMIN, ROLES.DEPARTMENT_HEAD), employees.list);
router.patch("/employees/:id", adminOnly, employees.update);

export default router;
