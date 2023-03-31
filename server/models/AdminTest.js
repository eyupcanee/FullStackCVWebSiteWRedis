import mongoose from "mongoose";

const AdminTestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    surname: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 100,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

const AdminTest = mongoose.Model("AdminTest", AdminTestSchema);
export default AdminTest;
