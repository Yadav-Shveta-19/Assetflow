import { body } from "express-validator";
import { ROLES } from "../constants/roles.js";

const passwordRule = body("password")
  .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  .withMessage("Password must contain uppercase, lowercase, number, and symbol");

export const signupValidator = [
  body("name").trim().isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail(),
  body("role").optional().isIn([ROLES.EMPLOYEE, ROLES.ADMIN]),
  passwordRule
];
export const loginValidator = [body("email").isEmail().normalizeEmail(), body("password").notEmpty()];
export const tokenValidator = [body("token").isLength({ min: 20 })];
export const forgotValidator = [body("email").isEmail().normalizeEmail()];
export const resetValidator = [body("token").isLength({ min: 20 }), passwordRule];
export const changePasswordValidator = [body("currentPassword").notEmpty(), body("newPassword").isStrongPassword({ minLength: 8 })];
