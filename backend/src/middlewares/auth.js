import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = async (req, _res, next) => {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;
    const token = bearer || req.cookies.accessToken;
    if (!token) throw new AppError("Authentication required", 401);
    const decoded = jwt.verify(token, env.accessSecret);
    const user = await User.findById(decoded.sub).select("-password");
    if (!user || !user.isActive) throw new AppError("Account is inactive or unavailable", 401);
    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new AppError("Invalid or expired access token", 401));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError("You are not authorized to perform this action", 403));
  next();
};
