const proxy = require("express-http-proxy");
const logger = require("../../utils/winston-logger");

const postServiceProxy = proxy(process.env.POST_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    const newPath = req.originalUrl.replace(/^\/v1/, "/api");
    return newPath;
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Post service proxy error: ${err.errors}`);
    res.status(500).json({
      "Request status": "Failed",
      message: `Post service proxy error: ${err.stack}`,
    });
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["Content-Type"] = "application/json";
    //Add "x-user-id" header which carries user ID after bearer token validation.
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(
      `Response received from Post service: ${proxyRes.statusCode}. Forwarding response to client.`,
    );
    return proxyResData;
  },
});

module.exports = postServiceProxy;
