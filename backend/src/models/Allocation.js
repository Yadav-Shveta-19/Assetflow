import mongoose from "mongoose";
import { ALLOCATION_STATUSES } from "../constants/status.js";

const allocationSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
    allocatedToUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    allocatedToDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department", index: true },
    allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expectedReturnDate: { type: Date, required: true, index: true },
    actualReturnDate: Date,
    conditionOnIssue: String,
    conditionOnReturn: String,
    notes: String,
    status: { type: String, enum: ALLOCATION_STATUSES, default: "Active", index: true }
  },
  { timestamps: true }
);

allocationSchema.index({ asset: 1, status: 1 });

export default mongoose.model("Allocation", allocationSchema);
