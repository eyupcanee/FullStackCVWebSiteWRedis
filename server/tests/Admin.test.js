const axios = require("axios");
const dotenv = require("dotenv");
const redis = require("redis");

dotenv.config();

const defCorrectToken = process.env.DEF_CORRECT_TOKEN;
const defWrongToken = process.env.DEF_WRONG_TOKEN;
const defCorrectId = process.env.DEF_CORRECT_ID;
const defWrongId = process.env.DEF_WRONG_ID;

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.log(`Error : ${error}`));

  await redisClient.connect();
})();

const baseUrl = process.env.DEF_BASE_URL;

const defAdmin = {
  name: "Eyüp Can",
  surname: "Esen",
  email: "eyupcanee@gmail.com",
  password: "eyupcanee",
  phoneNumber: "5551234567",
  role: "admin",
  token: defCorrectToken,
};

const defAdminForUpdate = {
  id: defCorrectId,
  name: "Eyüp Can Updated",
  surname: "Esen Updated",
  email: "eyupcanee@gmail.com",
  password: "eyupcanee",
  phoneNumber: "5551234567",
  role: "admin",
  token: defCorrectToken,
};

const defAdminWithWrongToken = {
  name: "Eyüp Can",
  surname: "Esen",
  email: "eyupcanee@gmail.com",
  password: "eyupcanee",
  phoneNumber: "5551234567",
  role: "admin",
  token: defWrongToken,
};

const defWrongAdmin = {
  name: "Eyüp Can",
  surname: "Esen",
  password: "eyupcanee",
  phoneNumber: "5551234567",
  role: "admin",
};

test("Correctly Add Admin Test", async () => {
  var res;
  await axios
    .post(`${baseUrl}admintest/admin/add`, defAdmin)
    .then((response) => (res = response.data.status));

  expect(res).toBe("ok");
});

test("Unauthorized Add Admin Test", async () => {
  var res;
  await axios
    .post(`${baseUrl}admintest/admin/add`, defAdminWithWrongToken)
    .then((response) => (res = response.data.status))
    .catch((error) => (res = error.response.data.status));

  expect(res).toBe("no");
});

test("Add Admin Test With Missing Data", async () => {
  var res;
  await axios
    .post(`${baseUrl}admintest/admin/add`, defWrongAdmin)
    .then((response) => (res = response.data.status))
    .catch((error) => (res = error.response.data.status));

  expect(res).toBe("no");
});

test("Login Correctly Test", async () => {
  const admin = {
    email: "eyupcanee@gmail.com",
    password: "eyupcanee",
  };
  var res;

  await axios
    .post(`${baseUrl}admintest/admin/login`, admin)
    .then((response) => {
      res = response.data.status;
    });

  expect(res).toBe("ok");
});

test("Login Test With Wrong Data", async () => {
  const admin = {
    email: "eyupcanee@gmail.com",
    password: "wrongPass",
  };
  var res;

  await axios
    .post(`${baseUrl}admintest/admin/login`, admin)
    .then((response) => {
      res = response.data.status;
    })
    .catch((error) => (res = error.response.data.status));

  expect(res).toBe("no");
});

test("Login Test With Missing Data", async () => {
  const admin = {
    password: "eyupcanee",
  };
  var res;

  await axios
    .post(`${baseUrl}admintest/admin/login`, admin)
    .then((response) => {
      res = response.data.status;
    });

  expect(res).toBe("no");
});

test("Log Out Correctly Test", async () => {
  var res;
  await axios
    .post(`${baseUrl}admintest/admin/logout`, { token: defCorrectToken })
    .then((response) => (res = response.data.status));

  expect(res).toBe("ok");
});

test("Log Out With Wrong Token Test", async () => {
  var res;
  await axios
    .post(`${baseUrl}admintest/admin/logout`, { token: defWrongToken })
    .then((response) => (res = response.data.status))
    .catch((error) => (res = error.response.data.status));

  expect(res).toBe("no");
});

test("Get All Admins Test", async () => {
  var res;
  await axios
    .get(`${baseUrl}admintest/admins`)
    .then((response) => (res = response.data.status));

  expect(res).toBe("ok");
});

test("Get Admin From Database Test", async () => {
  var res;
  var cache;
  await redisClient.del(defCorrectId);
  await axios
    .get(`${baseUrl}admintest/admin/${defCorrectId}`)
    .then((response) => {
      res = response.data.status;
      cache = response.data.fromCache;
    })
    .catch((error) => {
      res = error.response.data.status;
      cache = error.response.data.fromCache;
    });

  expect(res).toBe("ok");
  expect(cache).toBe(false);
});

test("Get Admin From Cache Test", async () => {
  var res;
  var cache;
  await axios
    .get(`${baseUrl}admintest/admin/${defCorrectId}`)
    .then((response) => {
      res = response.data.status;
      cache = response.data.fromCache;
    })
    .catch((error) => {
      res = error.response.data.status;
      cache = error.response.data.fromCache;
    });

  expect(res).toBe("ok");
  expect(cache).toBe(true);
});

test("Update Admin Test", async () => {
  var res;
  await axios
    .post(`${baseUrl}admintest/admin/update`, defAdminForUpdate)
    .then((response) => {
      res = response.data.status;
      console.log(response.data);
    })
    .catch((error) => {
      res = error.response.data.status;
    });

  expect(res).toBe("ok");
});

test("Delete Correctly Test", async () => {
  var res;
  await axios
    .delete(
      `${baseUrl}admintest/admin/delete/${defCorrectId}/${defCorrectToken}`
    )
    .then((response) => (res = response.data.status))
    .catch((error) => (res = error.response.data.status));

  expect(res).toBe("ok");
});

test("Delete Test With Wrong Id", async () => {
  var res;
  await axios
    .delete(`${baseUrl}admintest/admin/delete/${defWrongId}/${defCorrectToken}`)
    .then((response) => {
      res = response.data.status;
      console.log(response);
    })
    .catch((error) => {
      res = error.response.data.status;
      console.log(error.response);
    });
  expect(res).toBe("no");
});

test("Unauthorized Delete Test ", async () => {
  var res;
  await axios
    .delete(`${baseUrl}admintest/admin/delete/${defCorrectId}/${defWrongToken}`)
    .then((response) => (res = response.data.status))
    .catch((error) => (res = error.response.data.status));

  expect(res).toBe("no");
});
