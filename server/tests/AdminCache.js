import redis from "redis";

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.log(`Error : ${error}`));

  await redisClient.connect();
})();

export const getAdminCached = async (req, res, next) => {};
