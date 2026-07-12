import { connectDB } from "../config/db.js";
import { assertRequiredEnv, env } from "../config/env.js";
import User from "../models/User.js";
import { ROLES } from "../constants/roles.js";

assertRequiredEnv();
await connectDB();

const admin = await User.findOne({ email: env.seedAdmin.email });
if (!admin) {
  await User.create({ name: "AssetFlow Admin", email: env.seedAdmin.email, password: env.seedAdmin.password, role: ROLES.ADMIN, isEmailVerified: true });
  console.log(`Admin created: ${env.seedAdmin.email}`);
} else {
  console.log(`Admin already exists: ${env.seedAdmin.email}`);
}

const employee = await User.findOne({ email: env.seedEmployee.email });
if (!employee) {
  await User.create({ name: "AssetFlow Employee", email: env.seedEmployee.email, password: env.seedEmployee.password, role: ROLES.EMPLOYEE, isEmailVerified: true });
  console.log(`Employee created: ${env.seedEmployee.email}`);
} else {
  console.log(`Employee already exists: ${env.seedEmployee.email}`);
}
process.exit(0);
