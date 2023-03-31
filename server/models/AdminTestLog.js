import mongoose from "mongoose";

const AdminTestLogSchema = new mongoose.Schema(
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

const AdminTestLog = mongoose.Model("AdminTestLog", AdminTestLogSchema);
export default AdminTestLog;