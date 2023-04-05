import express from "express";
import {
  getAllAdmins,
  deleteAdmin,
  loginAdmin,
  logOutAdmin,
  addAdmin,
  updateAdmin,
  getAdmin,
} from "../controllers/AdminTest.js";
import { getAdminCached } from "../redis/AdminCache.js";

const router = express.Router();

router.get("/admins", getAllAdmins);
router.get("/admin/:id", getAdminCached, getAdmin);
router.post("/admin/add", addAdmin);
router.post("/admin/login", loginAdmin);
router.post("/admin/logout", logOutAdmin);
router.post("/admin/update", updateAdmin);
router.delete("/admin/delete/:id/:token", deleteAdmin);

export default router;
