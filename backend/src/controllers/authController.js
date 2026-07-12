import { sendCreated, sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as authService from "../services/authService.js";
import User from "../models/User.js";

const cookieOptions = { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true" };

const setCookies = (res, tokens, rememberMe = false) => {
  res.cookie("accessToken", tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", tokens.refreshToken, { ...cookieOptions, maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000 });
};

export const signup = asyncHandler(async (req, res) => {
  const user = await authService.signup(req.body, req);
  sendCreated(res, { id: user._id, email: user.email, role: user.role }, "Signup successful. Verify your email.");
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req);
  setCookies(res, result, req.body.rememberMe);
  delete result.user.password;
  sendSuccess(res, { user: result.user, accessToken: result.accessToken }, "Login successful");
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.rotateRefreshToken(req.cookies.refreshToken || req.body.refreshToken, req);
  setCookies(res, result);
  sendSuccess(res, { user: result.user, accessToken: result.accessToken }, "Session refreshed");
});

export const logout = asyncHandler(async (req, res) => {
  await authService.revokeRefreshToken(req.cookies.refreshToken || req.body.refreshToken);
  res.clearCookie("accessToken").clearCookie("refreshToken");
  sendSuccess(res, null, "Logged out");
});

export const me = asyncHandler(async (req, res) => sendSuccess(res, req.user, "Session valid"));
export const verifyEmail = asyncHandler(async (req, res) => sendSuccess(res, await authService.verifyEmail(req.body.token), "Email verified"));
export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body.email);
  sendSuccess(res, null, "If the email exists, a reset link has been sent");
});
export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  sendSuccess(res, null, "Password reset successful");
});
export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword))) return res.status(401).json({ success: false, message: "Current password is invalid" });
  user.password = req.body.newPassword;
  await user.save();
  sendSuccess(res, null, "Password changed");
});
export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = (({ name, phone, designation }) => ({ name, phone, designation }))(req.body);
  const user = await User.findByIdAndUpdate(req.user._id, allowed, { new: true, runValidators: true }).select("-password");
  sendSuccess(res, user, "Profile updated");
});
