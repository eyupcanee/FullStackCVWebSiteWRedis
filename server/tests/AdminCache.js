import redis from "redis";

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.log(`Error : ${error}`));

  await redisClient.connect();
})();

export const getAdminCached = async (req, res, next) => {
  const { id } = req.params;
  let results;

  try {
    const cacheResults = await redisClient.get(id);
    if (cacheResults) {
      results = JSON.parse(cacheResults);
      res.status(200).json({
        status: "ok",
        fromCache: true,
        data: results,
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(404).json({ status: "no" });
  }
};
