const logger = require("../utils/winston-logger");

const authenticateRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    logger.warn("Access denied! Access attempted without user ID!");
    return res.status(400).json({
      "Request status": "Failed",
      message: "Authentication required! Please login to continue.",
    });
  }
  req.user = { userId };
  next();
};

module.exports = authenticateRequest;
