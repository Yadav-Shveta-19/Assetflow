import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

export const signAccessToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.accessSecret, { expiresIn: env.accessExpiresIn });

export const signRefreshToken = (user, tokenId) =>
  jwt.sign({ sub: user._id.toString(), jti: tokenId }, env.refreshSecret, { expiresIn: env.refreshExpiresIn });

export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const randomToken = () => crypto.randomBytes(32).toString("hex");
