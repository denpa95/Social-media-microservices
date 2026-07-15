require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const router = require("./identity-service-router/router");
const logger = require("./utils/winston-logger");
const requestLogger = require("./middlewares/request-logger");
const {
  redisClient,
  serverRateLimiter,
} = require("./middlewares/rate-limiter");
const errorHandler = require("./middlewares/global-error-handler");

const connectToMongoDB = require("./utils/mongoDB-connect");

const app = express();
const port = process.env.PORT || 3001;

//Connect to MongoDB
connectToMongoDB();

//Setup middlewares. Helmet must always be the first middleware and error handler global middleware must be the last.
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(serverRateLimiter);
//Setup router
app.use("/api/auth", router);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(
    `Identity service is now live and listening to requests on port ${port}`,
  );
});

//Make a note for this:

process
  .on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled rejection:", reason);
  })
  .on("uncaughtException", (error) => {
    logger.error(`Uncaught exception thrown:`, error);
    process.exit(1);
  });
