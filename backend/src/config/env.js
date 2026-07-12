import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || "AssetFlow <noreply@assetflow.local>"
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  seedAdmin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },
  seedEmployee: {
    email: process.env.EMPLOYEE_EMAIL,
    password: process.env.EMPLOYEE_PASSWORD
  }
};

export const assertRequiredEnv = () => {
  const missing = ["MONGODB_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"].filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};
