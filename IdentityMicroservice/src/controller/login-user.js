const User = require("../models/user");
const generateTokens = require("../utils/generate-token");
const logger = require("../utils/winston-logger");
const { validateLoginData } = require("../utils/user-data-validation");

const loginUser = async (req, res, next) => {
  logger.info("User requests to login.");
  try {
    const { error } = validateLoginData(req.body);
    if (error) {
      logger.warn(`User login data error: ${error.details[0].message}`);
      return res.status(400).json({
        "Request status": "Failed",
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("User with the given email address doesn't exist");
      return res.status(404).json({
        "Request status": "Failed",
        message: "User with the given email address doesn't exist!",
      });
    }
    const passwordCheck = await user.comparePassword(password);
    if (!passwordCheck) {
      logger.warn("Incorrect password provided");
      return res.status(400).json({
        "Request status": "Failed",
        message: "Invalid password. Please provide accurate password!",
      });
    }
    //Generate access/refresh tokens for user
    const { accessToken, refreshToken } = await generateTokens(user);
    res.status(201).json({ accessToken, refreshToken, userId: user._id });
  } catch (error) {
    logger.error("Error performing user login", error);
    next(error);
  }
};

module.exports = loginUser;
