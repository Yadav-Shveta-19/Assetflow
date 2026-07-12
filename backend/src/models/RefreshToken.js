import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    tokenHash: { type: String, required: true, unique: true },
    revokedAt: Date,
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    replacedByTokenHash: String
  },
  { timestamps: true }
);

export default mongoose.model("RefreshToken", refreshTokenSchema);
