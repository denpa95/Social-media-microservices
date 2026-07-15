const { RedisStore } = require("rate-limit-redis");
const Redis = require("ioredis");
const { rateLimit } = require("express-rate-limit");
const logger = require("../utils/winston-logger");

const redisClient = new Redis(process.env.REDIS_URL);

const gatewayRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Too many requests from IP:${req.ip}! Please try again later.`);
    res.status(429).json({
      "Request status": "Failed",
      message: "Too many requests! Please try again later",
    });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

module.exports = { redisClient, gatewayRateLimiter };
