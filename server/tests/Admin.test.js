const axios = require("axios");
const dotenv = require("dotenv");
const redis = require("redis");

dotenv.config();

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.log(`Error : ${error}`));

  await redisClient.connect();
})();

const baseUrl = process.env.DEF_BASE_URL;

const defUser = {
  name: "Eyüp Can",
  surname: "Esen",
  email: "eyupcanee@gmail.com",
  password: "eyupcanee",
  phoneNumber: "5551234567",
  role: "admin",
};

const defWrongUser = {
  name: "Eyüp Can",
  surname: "Esen",
  email: "eyupcanee@gmail.com",
  password: "eyupcanee",
  phoneNumber: "5551234567",
  role: "admin",
};
