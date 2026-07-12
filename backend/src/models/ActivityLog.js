import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    module: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
