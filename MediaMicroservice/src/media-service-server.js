require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectToMongoDB = require("./utils/mongoDB-connect");
const requestLogger = require("./middlewares/request-logger");
const logger = require("./utils/winston-logger");
const mediaRouter = require("./media-service-router/router");
const {
  redisClient,
  serverRateLimiter,
} = require("./middlewares/rate-limiter");
const errorHandler = require("./middlewares/global-error-handler");
const { connectToRabbitMQ, consumeEvent } = require("./utils/rabbitMQ");
const handlePostDeletion = require("./events/post-deletion-event");

//Create express server
const app = express();
const port = process.env.PORT || 3003;

//Connect to MongoDB
connectToMongoDB();

//Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(serverRateLimiter);
app.use(
  "/api/media",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  mediaRouter,
);
app.use(errorHandler);

(async function () {
  try {
    logger.info("Attempting connection to RabbitMQ server");
    await connectToRabbitMQ();
    //Consume post deletion event
    await consumeEvent("post:deleted", handlePostDeletion);

    //Start media microservice server
    app.listen(port, () => {
      logger.info(
        `Media microservice is now live and listening to port ${3003}`,
      );
    });
  } catch (error) {
    logger.error(`Failed to connect server: ${error}`);
    process.exit(1);
  }
})();

process
  .on("uncaughtException", (error) => {
    logger.error(`Uncaught exception thrown: ${error}`);
    process.exit(1);
  })
  .on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled rejection: ${promise} - ${reason}`);
    process.exit(1);
  });
