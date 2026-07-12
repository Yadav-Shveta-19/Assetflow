import mongoose from "mongoose";
import { ASSET_STATUSES } from "../constants/status.js";

const fileSchema = new mongoose.Schema(
  { url: String, publicId: String, originalName: String, mimeType: String, size: Number },
  { _id: false }
);

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: "text" },
    assetTag: { type: String, required: true, unique: true, index: true },
    qrCode: { type: String, required: true },
    barcode: { type: String, index: true },
    serialNumber: { type: String, required: true, unique: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "AssetCategory", required: true, index: true },
    brand: String,
    model: String,
    vendor: String,
    purchaseDate: Date,
    acquisitionDate: Date,
    warrantyMonths: Number,
    warrantyExpiry: Date,
    acquisitionCost: { type: Number, min: 0 },
    condition: { type: String, enum: ["New", "Good", "Fair", "Poor", "Damaged"], default: "Good" },
    location: { type: String, index: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", index: true },
    currentHolder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sharedResource: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ASSET_STATUSES, default: "Available", index: true },
    description: String,
    photo: fileSchema,
    documents: [fileSchema],
    customData: mongoose.Schema.Types.Mixed,
    retiredAt: Date,
    disposedAt: Date
  },
  { timestamps: true }
);

assetSchema.index({ name: "text", assetTag: "text", serialNumber: "text", location: "text" });

export default mongoose.model("Asset", assetSchema);
