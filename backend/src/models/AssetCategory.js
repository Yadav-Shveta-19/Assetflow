import mongoose from "mongoose";

const customFieldSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    fieldType: { type: String, enum: ["text", "number", "date", "boolean"], default: "text" },
    required: { type: Boolean, default: false }
  },
  { _id: false }
);

const assetCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    warrantyPeriodMonths: { type: Number, min: 0, default: 12 },
    icon: { type: String, default: "Package" },
    color: { type: String, default: "#2563eb" },
    customFields: [customFieldSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("AssetCategory", assetCategorySchema);
