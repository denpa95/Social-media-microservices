const logger = require("../utils/winston-logger");

const invalidateCache = async (req, postId) => {
  const keys = await req.redisClient.keys("posts:*");
  if (keys.length > 0) {
    await req.redisClient.del(keys);
    logger.info(
      "Redis Cache: All posts saved in cache has been successfully deleted",
    );
  }
  if (postId) {
    await req.redisClient.del(`post:${postId}`);
    logger.info(`Redis Cache: Post ID-${postId} is deleted from cache`);
  }
};

module.exports = invalidateCache;
