const proxy = require("express-http-proxy");
const logger = require("../../utils/winston-logger");

const mediaServiceProxy = proxy(process.env.MEDIA_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    const newPath = req.originalUrl.replace(/^\/v1/, "/api");
    return newPath;
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Media service proxy error: ${err}`);
    res.status(500).json({
      "Request status": "Failed",
      message: `Media service proxy error: ${err}`,
    });
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
    if (
      proxyReqOpts.headers["Content-Type"] &&
      !proxyReqOpts["Content-Type"].startsWith("multipart/form-data")
    ) {
      proxyReqOpts.headers["Content-Type"] = "application/json";
    }
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(
      `Response received from Media service server: ${proxyRes.statusCode}. Forwarding response to client`,
    );
    return proxyResData;
  },
});

module.exports = mediaServiceProxy;
