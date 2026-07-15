require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port || 3004;
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./utils/winston-logger");

const connectToMongoDB = require("./utils/mongoDB-connect");
const requestLogger = require("./middlewares/request-logger");
const {
  redisClient,
  serverRateLimiter,
} = require("./middlewares/rate-limiter");
const router = require("./search-service-router/search-service-router");
const { connectToRabbitMQ, consumeEvent } = require("./utils/rabbitMQ");
const handlePostCreation = require("./events/handle-post-creation");
const handlePostDeletion = require("./events/handle-post-deletion");
connectToMongoDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(serverRateLimiter);
app.use(
  "/api/search",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  router,
);

(async function () {
  try {
    logger.info(`Connecting to RabbitMQ server..`);
    await connectToRabbitMQ();
    logger.info(`Listening to post related events.`);
    await consumeEvent("post:created", (event) => {
      handlePostCreation(event, redisClient);
    });
    await consumeEvent("post:deleted", (event) => {
      handlePostDeletion(event, redisClient);
    });
    app.listen(port, () => {
      logger.info(`Search server is now live and listening to port ${port}`);
    });
  } catch (error) {
    logger.error(`Failed to connect to server: ${error}`);
  }
})();
