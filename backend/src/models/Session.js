import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    refreshToken: { type: mongoose.Schema.Types.ObjectId, ref: "RefreshToken" },
    ipAddress: String,
    userAgent: String,
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
