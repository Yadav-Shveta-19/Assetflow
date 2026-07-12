import mongoose from "mongoose";

const auditCycleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    assignedAuditor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedAuditors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    departmentScope: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
    locationScope: [String],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["Draft", "Active", "Closed", "Locked"], default: "Draft", index: true },
    discrepancySummary: String,
    closedAt: Date,
    lockedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("AuditCycle", auditCycleSchema);
