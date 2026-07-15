const logger = require("./winston-logger");

const invalidateSearchCache = async (redisClient) => {
  const keyPattern = "search:*";
  const keys = await redisClient.keys(keyPattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
    logger.info(`Search cache is now cleared.`);
  }
};

module.exports = invalidateSearchCache;
