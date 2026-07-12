import Asset from "../models/Asset.js";
import { sendCreated, sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildQueryOptions } from "../utils/pagination.js";
import { createAsset } from "../services/assetService.js";

export const listAssets = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, search } = buildQueryOptions(req.query);
  const filter = {};
  if (search) filter.$or = ["name", "assetTag", "serialNumber", "location"].map((field) => ({ [field]: new RegExp(search, "i") }));
  for (const key of ["category", "department", "status", "location", "sharedResource"]) if (req.query[key]) filter[key] = req.query[key];
  const [items, total] = await Promise.all([
    Asset.find(filter).populate("category department currentHolder", "name email code").sort(sort).skip(skip).limit(limit),
    Asset.countDocuments(filter)
  ]);
  sendSuccess(res, items, "Assets fetched", 200, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const getAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id).populate("category department currentHolder", "name email code");
  if (!asset) return res.status(404).json({ success: false, message: "Asset not found" });
  sendSuccess(res, asset, "Asset fetched");
});

export const registerAsset = asyncHandler(async (req, res) => sendCreated(res, await createAsset(req.body), "Asset registered"));
export const updateAsset = asyncHandler(async (req, res) => sendSuccess(res, await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }), "Asset updated"));
