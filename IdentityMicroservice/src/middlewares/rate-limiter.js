const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis"); //to be used with rateLimit
const logger = require("../utils/winston-logger");

//Create Redis client
const redisClient = new Redis(process.env.REDIS_URL);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

const serverRateLimiter = async (req, res, next) => {
  try {
    console.log("Server rate limit vetting incoming request!");
    await rateLimiter.consume(req.ip);
    console.log("No problem please proceed");
    next();
  } catch (error) {
    logger.warn(`Request limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      "Request status": "Failed",
      message: "Number of request sent by user exceeds given limit.",
    });
  }
};

const endpointRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      `IP ${req.ip} has exceeded the rate limit! Please try again later!`,
    );
    res.status(429).json({
      "Request status": "Failed",
      message: "Too many requests! Please try again later.",
    });
  },
  store: new RedisStore({
    sendCommand: (command, ...args) => redisClient.call(command, ...args),
  }),
});

module.exports = { redisClient, serverRateLimiter, endpointRateLimiter };
