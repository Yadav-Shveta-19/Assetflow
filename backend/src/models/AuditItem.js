import mongoose from "mongoose";
import { AUDIT_ITEM_STATUSES } from "../constants/status.js";

const auditItemSchema = new mongoose.Schema(
  {
    auditCycle: { type: mongoose.Schema.Types.ObjectId, ref: "AuditCycle", required: true, index: true },
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: AUDIT_ITEM_STATUSES, required: true },
    notes: String,
    verifiedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("AuditItem", auditItemSchema);
