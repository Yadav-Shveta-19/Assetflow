import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ROLE_VALUES, ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLE_VALUES, default: ROLES.EMPLOYEE, index: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    phone: { type: String, trim: true },
    designation: { type: String, trim: true },
    avatar: { url: String, publicId: String },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    emailVerificationTokenHash: String,
    emailVerificationExpires: Date,
    passwordResetTokenHash: String,
    passwordResetExpires: Date,
    lastLoginAt: Date
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
