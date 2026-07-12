import mongoose from "mongoose";
import { TRANSFER_STATUSES } from "../constants/status.js";

const transferRequestSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fromDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    toDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: TRANSFER_STATUSES, default: "Requested", index: true },
    reason: String,
    decisionNotes: String,
    completedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("TransferRequest", transferRequestSchema);
