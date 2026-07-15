const proxy = require("express-http-proxy");
const logger = require("../../utils/winston-logger");

const identityServiceProxy = proxy(process.env.IDENTITY_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    const newPath = req.originalUrl.replace(/^\/v1/, "/api");
    return newPath;
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Identity service proxy error: ${err.errors}`);
    res.status(500).json({
      "Request status": "Failed",
      message: `Identity service proxy error: ${err.stack}`,
    });
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["Content-Type"] = "application/json";
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(
      `Response received from Identity-service: ${proxyRes.statusCode}. Forwarding response to client.`,
    );
    return proxyResData;
  },
});

module.exports = identityServiceProxy;
