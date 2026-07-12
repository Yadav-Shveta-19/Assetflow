import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    parentDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: String,
    description: String,
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

departmentSchema.virtual("employeeCount", {
  ref: "User",
  localField: "_id",
  foreignField: "department",
  count: true
});

export default mongoose.model("Department", departmentSchema);
