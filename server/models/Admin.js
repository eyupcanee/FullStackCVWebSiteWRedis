import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
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
      unique: true,
      max: 100,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: String,
  },
  { timestamps: true }
);

const Admin = mongoose.Model("Admin", AdminSchema);
export default Admin;
