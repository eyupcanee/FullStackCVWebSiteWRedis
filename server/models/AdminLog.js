import mongoose from "mongoose";

const AdminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    logMessage: {
      type: String,
      min: 2,
    },
    logType: {
      type: String,
      required: true,
      enum: ["login", "logout", "insert", "update", "delete"],
    },
    success: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const AdminLog = mongoose.Model("AdminLog", AdminLogSchema);
export default AdminLog;
