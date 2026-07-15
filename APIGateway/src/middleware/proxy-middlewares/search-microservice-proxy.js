const proxy = require("express-http-proxy");
const logger = require("../../utils/winston-logger");

const searchServiceProxy = proxy(process.env.SEARCH_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    const newPath = req.originalUrl.replace(/^\/v1/, "/api");
    return newPath;
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Search service proxy error: ${err}`);
    res.status(500).json({
      "Request status": "Failed",
      message: `Search service proxy error.`,
    });
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["Content-Type"] = "application/json";
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(
      `Response received from search microservice: ${proxyRes.statusCode}`,
    );
    return proxyResData;
  },
});

module.exports = searchServiceProxy;
