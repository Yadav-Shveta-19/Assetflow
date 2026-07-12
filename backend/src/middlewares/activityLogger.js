import ActivityLog from "../models/ActivityLog.js";

export const writeActivity = async ({ user, module, action, oldValue, newValue, req }) => {
  await ActivityLog.create({
    user: user?._id || user,
    module,
    action,
    oldValue,
    newValue,
    ipAddress: req?.ip,
    userAgent: req?.headers?.["user-agent"]
  });
};
