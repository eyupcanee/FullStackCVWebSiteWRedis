import mongoose from "mongoose";
import AdminTest from "../models/AdminTest.js";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import bcrypt from "bcrypt";
import npmlog from "npmlog";
import { AdminAuthorize } from "../utils/Authorize.js";
import { GetId } from "../utils/GetTokenData.js";
import { insertAdminLog } from "./AdminTestLog.js";
import redis from "redis";

let redisClient;

const defProcessorId = "000000000000000000000000";

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.log(`Error : ${error}`));

  await redisClient.connect();
})();

export const loginAdmin = async (req, res) => {
  try {
    const password = req.body.password;
    const admin = await AdminTest.findOne({
      email: req.body.email,
    });
    if (!admin) {
      res.status(200).json({ status: "no", message: "No such record found!" });
    }
    if (await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign(
        {
          id: admin._id,
          role: admin.role,
        },
        process.env.JWT_CODE
      );
      const logMessage = `${admin.name} ${admin.surname} Has Logged In As A Admin | Admin Id : ${admin._id}`;
      await insertAdminLog({
        id: admin._id,
        logMessage: logMessage,
        logType: "login",
        success: true,
      });
      npmlog.info(logMessage);
      res.status(200).json({ status: "ok", token: token });
    } else {
      const logMessage = `${admin.name} ${admin.surname} Has Tried Login In As A Admin With Wrong Password | Admin Id : ${admin._id}`;
      await insertAdminLog({
        id: admin._id,
        logMessage: logMessage,
        logType: "login",
        success: false,
      });
      npmlog.warn(logMessage);
      res.status(200).json({ status: "no" });
    }
  } catch (error) {
    res.status(404).json({ status: "no" });
  }
};

export const logOutAdmin = async (req, res) => {
  const { token } = req.body.token;
  const ProcessorId = await GetId(token);
  try {
    if (await AdminAuthorize(token)) {
      const logMessage = `${ProcessorId} Has Logged Out`;
      await insertAdminLog({
        id: ProcessorId,
        logMessage: logMessage,
        logType: "logout",
        success: true,
      });
      npmlog.info(logMessage);
      res.status(200).json({ status: "ok" });
    } else {
      const logMessage = `${ProcessorId} Has Tried To Log Out`;
      await insertAdminLog({
        id: ProcessorId,
        logMessage: logMessage,
        logType: "logout",
        success: false,
      });
      npmlog.warn(logMessage);
      res.status(404).json({ status: "no" });
    }
  } catch (error) {
    res.status(404).json({ status: "no" });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminTest.find({ role: "admin" }).select("-password");
    res.status(200).json({ status: "ok", fromCache: false, data: admins });
  } catch (error) {
    res.status(404).json({ status: "no", message: error.message });
  }
};

// This function has coded for just test. This is about to getting data directly from database
export const getAdmin = async (req, res) => {
  const { id } = req.params;
  await redisClient.del(id);
  try {
    const admin = await AdminTest.findById(id);
    await redisClient.set(id, JSON.stringify(admin));
    res.status(200).json({ status: "ok", fromCache: false, data: admin });
  } catch (error) {
    res.status(404).json({ status: "no", message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const { token } = req.body;
  const ProcessorId = GetId(token);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ status: "no", message: "Wrong Id Type!" });
    } else {
      const admin = await AdminTest.find({
        id: id,
      });

      if (!admin) {
        res
          .status(404)
          .json({ status: "no", message: "There Isn't Admin With This Id!" });
      } else {
        await AdminTest.findByIdAndRemove(id);
        const logMessage = `${admin.name} ${admin.surname} Has Deleted | Admin Id : ${id} | Made By : ${ProcessorId}`;
        await insertAdminLog({
          id: ProcessorId,
          logMessage: logMessage,
          logType: "delete",
          success: true,
        });
        npmlog.info(logMessage);
        res.status(200).json({ status: "ok" });
      }
    }
  } catch (error) {
    res.status(404).json({ status: "no", message: error.message });
  }
};

export const addAdmin = async (req, res) => {
  const { name, surname, email, password, phoneNumber, role, token } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 8);
  const ProcessorId = await GetId(token);
  const newAdmin = new AdminTest({
    name,
    surname,
    email,
    password: encryptedPassword,
    phoneNumber,
    role,
  });

  try {
    if (await AdminAuthorize(token)) {
      await newAdmin.save();
      const logMessage = `New Admin Has Added | New Admin : ${newAdmin.name} ${newAdmin.surname} | Made By : ${ProcessorId}`;
      npmlog.info(logMessage);
      await insertAdminLog({
        id: adminId,
        logMessage: logMessage,
        logType: "insert",
        success: true,
      });
      res.status(200).json({ status: "ok" });
    } else {
      const logMessage = `Unauthorized New Admin Insterion Has Tried | New Admin : ${
        newAdmin.name
      } ${newAdmin.surname} | Tried By : ${
        ProcessorId ? ProcessorId : defProcessorId
      }`;
    }
    npmlog.warn(logMessage);
    await insertAdminLog({
      id: `${ProcessorId ? ProcessorId : defProcessorId}`,
      logMessage: logMessage,
      logType: "insert",
      success: false,
    });
    res.status(404).json({
      status: "no",
      message: "You don't have permission for this process!",
    });
  } catch (error) {
    const logMessage = `New Admin Insertion Has Tried | New Admin : ${
      newAdmin.name
    } | Tried By : ${ProcessorId ? ProcessorId : defProcessorId} | Error : ${
      error.message
    }`;
  }
  await insertAdminLog({
    id: `${ProcessorId ? ProcessorId : defProcessorId}`,
    logMessage: logMessage,
    logType: "insert",
    success: false,
  });
  npmlog.warn(logMessage);
};

export const updateAdmin = async (req, res) => {
  const { id, name, surname, password, phoneNumber, token } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 8);
  const ProcessorId = GetId(token);
  try {
    if (await AdminAuthorize(token)) {
      await AdminTest.findByIdAndUpdate(id, {
        name: name,
        surname: surname,
        email: email,
        password: encryptedPassword,
        phoneNumber: phoneNumber,
      });

      const logMessage = `${name} ${surname}'s Datas Have Updated | Data Owner : ${id} | Made By : ${ProcessorId}`;
      await insertAdminLog({
        id: ProcessorId,
        logMessage: logMessage,
        logType: "update",
        success: true,
      });
      npmlog.info(logMessage);
      res.status(200).json({ status: "ok" });
    } else {
      const logMessage = `${name} ${surname}'s Datas Have Tried Update | Data Owner : ${id} | Made By : ${
        ProcessorId ? ProcessorId : defProcessorId
      }`;
      await insertAdminLog({
        id: `${ProcessorId ? ProcessorId : defProcessorId}`,
        logMessage: logMessage,
        logType: "update",
        success: false,
      });
      npmlog.warn(logMessage);

      res.status(404).json({
        status: "no",
        message: "You Don't Have Permission For This Process!",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "no",
      message: error.message,
    });
  }
};
