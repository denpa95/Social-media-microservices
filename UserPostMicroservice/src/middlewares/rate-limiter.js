const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");

const redisClient = new Redis(process.env.REDIS_URL);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

const serverRateLimiter = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (error) {
    logger.warn(
      `Too many requests from IP:${req.ip} to server. Rate limit exceeded!`,
    );
    res.status(429).json({
      "Request status": "Failed",
      message: "Too many requests to server! Please try again later!",
    });
  }
};

module.exports = { redisClient, serverRateLimiter };
