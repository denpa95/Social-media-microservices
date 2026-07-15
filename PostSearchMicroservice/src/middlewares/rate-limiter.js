//const { rateLimit } = require("express-rate-limit");
const Redis = require("ioredis");
//const { RedisStore } = require("rate-limit-redis");
const { RateLimiterRedis } = require("rate-limiter-flexible");

const redisClient = new Redis(process.env.REDIS_URL);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "search_rl",
  points: 10,
  duration: 1,
  blockDuration: 60,
});

const serverRateLimiter = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (error) {
    logger.error(`Number of request allowed was exceeded by user: ${req.ip}`);
    res.status(429).json({
      "Request status": "Failed",
      message: "Number of allowed request exceeded by user!",
    });
  }
};

module.exports = { redisClient, serverRateLimiter };
