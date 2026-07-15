const logger = require("../utils/winston-logger");
const RefreshToken = require("../models/refreshToken");
const { validateRefreshToken } = require("../utils/user-data-validation");

const logoutUser = async (req, res, next) => {
  logger.info("User requests to logout.");
  try {
    const { error } = validateRefreshToken(req.body);
    if (error) {
      logger.warn(
        `Refresh token validation error: ${error.details[0].message}`,
      );
      return res.status(400).json({
        "Request status": "Failed",
        message: error.details[0].message,
      });
    }
    const token = await RefreshToken.findOneAndDelete({
      token: req.body.refreshToken,
    });
    if (!token) {
      logger.warn("Token doesn't exist or has expired.");
      return res.status(404).json({
        "Request status": "Failed",
        message: "Refresh token doesn't exist or has expired.",
      });
    }
    res.json({
      "Request status": "Success",
      message: "User has successfully logged out.",
    });
  } catch (error) {
    logger.error("Error logging out user", error);
    next(error);
  }
};

module.exports = logoutUser;
