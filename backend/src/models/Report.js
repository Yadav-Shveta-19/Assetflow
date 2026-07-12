import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, index: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parameters: mongoose.Schema.Types.Mixed,
    file: { url: String, publicId: String, format: String },
    status: { type: String, enum: ["Queued", "Generated", "Failed"], default: "Generated" }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
