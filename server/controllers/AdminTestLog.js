import mongoose from "mongoose";
import AdminLog from "../models/AdminLog.js";

export const insertAdminLog = async (log) => {
  const newLog = new AdminLog({
    admin: log.id,
    logMessage: log.logMessage,
    logType: log.logType,
    success: log.success,
  });

  try {
    await newLog.save();
  } catch (error) {
    console.log(error.message);
  }
};
