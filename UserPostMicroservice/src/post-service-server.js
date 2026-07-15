require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");

const express = require("express");
const app = express();
const port = process.env.PORT || 3002;

const connectToMongoDB = require("./utils/mongoDB-connect");
const postRouter = require("./post-service-router/router");
const logger = require("./utils/winston-logger");
const {
  redisClient,
  serverRateLimiter,
} = require("./middlewares/rate-limiter");
const requestLogger = require("./middlewares/request-logger");
const errorHandler = require("./middlewares/global-error-handler");

connectToMongoDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(serverRateLimiter);
app.use(
  "/api/posts",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  postRouter,
);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`User post service is now live and listening to port: ${port}`);
});

process
  .on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled rejection error at: ${promise} - ${reason}`);
    //process.exit(1);
  })
  .on("uncaughtException", (error) => {
    logger.error(`Uncaught exception thrown: ${error}`);
    process.exit(1);
  });
