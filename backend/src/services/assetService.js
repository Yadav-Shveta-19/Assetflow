import QRCode from "qrcode";
import Asset from "../models/Asset.js";
import Counter from "../models/Counter.js";
import Allocation from "../models/Allocation.js";
import { AppError } from "../utils/AppError.js";
import { formatAssetTag } from "../helpers/assetTag.js";

export const createAsset = async (payload) => {
  const counter = await Counter.findOneAndUpdate({ key: "assetTag" }, { $inc: { value: 1 } }, { new: true, upsert: true });
  const assetTag = formatAssetTag(counter.value);
  const qrCode = await QRCode.toDataURL(assetTag);
  return Asset.create({ ...payload, assetTag, qrCode, barcode: payload.barcode || assetTag });
};

export const ensureAllocatable = async (assetId) => {
  const asset = await Asset.findById(assetId).populate("currentHolder", "name email");
  if (!asset) throw new AppError("Asset not found", 404);
  const active = await Allocation.findOne({ asset: assetId, status: "Active" }).populate("allocatedToUser allocatedToDepartment", "name email code");
  if (!["Available", "Reserved"].includes(asset.status) || active) {
    throw new AppError("Asset is already allocated. Create a transfer request instead.", 409, {
      currentHolder: active?.allocatedToUser || asset.currentHolder || active?.allocatedToDepartment,
      suggestedAction: "TRANSFER_REQUEST"
    });
  }
  return asset;
};

export const changeAssetStatus = async (assetId, nextStatus, allowedFrom) => {
  const asset = await Asset.findById(assetId);
  if (!asset) throw new AppError("Asset not found", 404);
  if (allowedFrom && !allowedFrom.includes(asset.status)) throw new AppError(`Cannot move asset from ${asset.status} to ${nextStatus}`, 409);
  asset.status = nextStatus;
  await asset.save();
  return asset;
};
