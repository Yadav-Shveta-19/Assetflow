import { Router } from "express";
import * as asset from "../controllers/assetController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/errorHandler.js";
import { assetValidator } from "../validators/moduleValidators.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.use(authenticate);
router.get("/", asset.listAssets);
router.get("/:id", asset.getAsset);
router.post("/", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), assetValidator, validateRequest, asset.registerAsset);
router.patch("/:id", authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), asset.updateAsset);

export default router;
