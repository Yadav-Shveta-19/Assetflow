import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import Session from "../models/Session.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import { hashToken, randomToken, signAccessToken, signRefreshToken } from "../utils/tokens.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "./emailService.js";
import { ROLES } from "../constants/roles.js";
import { writeActivity } from "../middlewares/activityLogger.js";

const refreshExpiryDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export const issueAuthTokens = async (user, req) => {
  const tokenId = crypto.randomUUID();
  const refreshToken = signRefreshToken(user, tokenId);
  const tokenHash = hashToken(refreshToken);
  const session = await Session.create({
    user: user._id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    expiresAt: refreshExpiryDate()
  });
  const tokenDoc = await RefreshToken.create({ user: user._id, session: session._id, tokenHash, expiresAt: session.expiresAt });
  session.refreshToken = tokenDoc._id;
  await session.save();
  return { accessToken: signAccessToken(user), refreshToken };
};

export const signup = async ({ name, email, password, role = ROLES.EMPLOYEE }, req) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email is already registered", 409);
  const verificationToken = randomToken();
  const user = await User.create({
    name,
    email,
    password,
    role,
    emailVerificationTokenHash: hashToken(verificationToken),
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });
  await writeActivity({
    user,
    module: "Auth",
    action: "Account Created",
    newValue: { name: user.name, email: user.email, role: user.role },
    req
  });
  await sendVerificationEmail(user, verificationToken);
  return user;
};

export const login = async ({ email, password }, req) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) throw new AppError("Invalid email or password", 401);
  if (!user.isActive) throw new AppError("Account is deactivated", 403);
  user.lastLoginAt = new Date();
  await user.save();
  await writeActivity({
    user,
    module: "Auth",
    action: "Login",
    newValue: { email: user.email, role: user.role, lastLoginAt: user.lastLoginAt },
    req
  });
  return { user: user.toObject({ versionKey: false }), ...(await issueAuthTokens(user, req)) };
};

export const verifyEmail = async (token) => {
  const tokenHash = hashToken(token);
  const user = await User.findOne({ emailVerificationTokenHash: tokenHash, emailVerificationExpires: { $gt: new Date() } });
  if (!user) throw new AppError("Invalid or expired verification token", 400);
  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  return user;
};

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return;
  const token = randomToken();
  user.passwordResetTokenHash = hashToken(token);
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  await sendPasswordResetEmail(user, token);
};

export const resetPassword = async ({ token, password }) => {
  const user = await User.findOne({ passwordResetTokenHash: hashToken(token), passwordResetExpires: { $gt: new Date() } });
  if (!user) throw new AppError("Invalid or expired reset token", 400);
  user.password = password;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

export const rotateRefreshToken = async (refreshToken, req) => {
  if (!refreshToken) throw new AppError("Refresh token required", 401);
  try {
    const decoded = jwt.verify(refreshToken, env.refreshSecret);
    const tokenHash = hashToken(refreshToken);
    const stored = await RefreshToken.findOne({ tokenHash, user: decoded.sub, revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } });
    if (!stored) throw new AppError("Invalid refresh token", 401);
    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) throw new AppError("User unavailable", 401);
    stored.revokedAt = new Date();
    const next = await issueAuthTokens(user, req);
    stored.replacedByTokenHash = hashToken(next.refreshToken);
    await stored.save();
    return { user, ...next };
  } catch (error) {
    if (error.statusCode) throw error;
    throw new AppError("Invalid or expired refresh token", 401);
  }
};

export const revokeRefreshToken = async (refreshToken) => {
  if (!refreshToken) return;
  await RefreshToken.findOneAndUpdate({ tokenHash: hashToken(refreshToken) }, { revokedAt: new Date() });
};
