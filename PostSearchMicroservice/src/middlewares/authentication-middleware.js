const logger = require("../utils/winston-logger");

const authenticateRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    logger.warn("User is not signed in! Please sign in to continue!");
    res.status(400).json({
      "Request status": "Failed",
      message: "Please login to continue",
    });
  }
  req.user = { userId };
  next();
};

module.exports = authenticateRequest;
