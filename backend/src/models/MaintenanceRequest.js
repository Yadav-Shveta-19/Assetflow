import mongoose from "mongoose";
import { MAINTENANCE_STATUSES } from "../constants/status.js";

const imageSchema = new mongoose.Schema({ url: String, publicId: String }, { _id: false });

const maintenanceRequestSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium", index: true },
    description: { type: String, required: true },
    images: [imageSchema],
    status: { type: String, enum: MAINTENANCE_STATUSES, default: "Pending", index: true },
    resolutionNotes: String,
    resolvedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
