const RefreshToken = require("../models/refreshToken");
const User = require("../models/user");
const logger = require("../utils/winston-logger");
const { validateRefreshToken } = require("../utils/user-data-validation");
const generateTokens = require("../utils/generate-token");

const refreshTokenEndpoint = async (req, res, next) => {
  logger.info(
    "Incoming request from client to validate refresh token and renew access token.",
  );
  try {
    //Validate token format from user provided data.
    const { error } = validateRefreshToken(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      logger.warn(`Refresh token validation error: ${errorMessage}`);
      return res.status(400).json({
        "Request status": "Failed",
        message: errorMessage,
      });
    }

    //Destructure refresh token from request body.
    const { refreshToken } = req.body;

    //Check if given refresh token exist or has expired.
    const token = await RefreshToken.findOne({ token: refreshToken });
    if (!token || token.expiresAt < new Date()) {
      logger.warn("Refresh token doesn't exist/expired! Please login again.");
      return res.status(404).json({
        "Request status": "Failed",
        message: "Refresh token doesn't exist/expired! Please login again",
      });
    }

    //Find user using userID field in token
    const user = await User.findById(token.user);

    //Create new access/refresh token for user and destructure the tokens.
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(user);

    //Delete current refreshToken
    await RefreshToken.findByIdAndDelete(token._id);

    //Send new tokens in response to user.
    res.status(201).json({
      "Request status": "Success",
      message: "New access token and refresh token generated.",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error("Error performing token validation/renewal", error);
    next(error);
  }
};

module.exports = refreshTokenEndpoint;
