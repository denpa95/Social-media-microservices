const jwt = require("jsonwebtoken");
const logger = require("../utils/winston-logger");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    logger.warn("Access token is not found! Please login to continue.");
    return res.status(401).json({
      "Request status": "Failed",
      message: "Unauthorized user! Please login to continue.",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      logger.warn(`Invalid token provided.`);
      return res.status(401).json({
        "Request status": "Failed",
        message: "Invalid access token provided. Access denied",
      });
    }
    req.user = user;
    next();
  });
};

module.exports = validateToken;
