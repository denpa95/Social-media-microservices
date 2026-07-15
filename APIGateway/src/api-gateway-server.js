require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./utils/winston-logger");
const requestLogger = require("./middleware/request-logger");
const errorHandler = require("./middleware/global-error-handler");
const {
  redisClient,
  gatewayRateLimiter,
} = require("./middleware/rate-limiter");
const validateToken = require("./middleware/validateToken");
const identityServiceProxy = require("./middleware/proxy-middlewares/identity-microservice-proxy");
const postServiceProxy = require("./middleware/proxy-middlewares/post-microservice-proxy");
const mediaServiceProxy = require("./middleware/proxy-middlewares/media-microservice-proxy");
const searchServiceProxy = require("./middleware/proxy-middlewares/search-microservice-proxy");

const port = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
//Implement rate-limiting for api-gateway server
app.use(gatewayRateLimiter);
app.use(requestLogger);
//Apply proxy for identity-microservice
app.use("/v1/auth", identityServiceProxy);
//Apply proxy for post-microservice. Incoming request undergoes token validation to authenticate user.
app.use("/v1/posts", validateToken, postServiceProxy);
//Apply proxy for media-microservice. Incoming request from client undergoes token validation to authenticate user.
app.use("/v1/media", validateToken, mediaServiceProxy);
//Apply proxy for search-microservice. Incoming request from client undergoes token validation to authenticate user
app.use("/v1/search", validateToken, searchServiceProxy);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(
    `API-Gateway is now live and listening to requests on port: ${port}.`,
  );
});

process
  .on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled promise rejection:`, promise);
    if (reason instanceof Error) {
      logger.error(`Reason(Error): ${reason.message}`);
      logger.error(`Stack Trace: ${reason.stack}`);
    } else {
      logger.error("Reason(Non-error):", JSON.stringify(reason));
    }
  })
  .on("uncaughtException", (error) => {
    logger.error("Uncaught exception thrown", error);
    process.exit(1);
  });
