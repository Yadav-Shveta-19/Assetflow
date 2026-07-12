import { validationResult } from "express-validator";

export const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ statusCode: 422, message: "Validation failed", details: errors.array() });
  }
  next();
};

export const notFound = (req, _res, next) => next({ statusCode: 404, message: `Route not found: ${req.originalUrl}` });

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || undefined
  });
};
