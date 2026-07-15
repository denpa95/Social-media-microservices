const User = require("../models/user");
const { validateRegistrationData } = require("../utils/user-data-validation");
const generateTokens = require("../utils/generate-token");
const logger = require("../utils/winston-logger");

const registerUser = async (req, res, next) => {
  logger.info("Incoming request for new user registration.");
  try {
    const { error } = validateRegistrationData(req.body);
    if (error) {
      //JOI validation error testing
      logger.warn("Registration data validation error ", error);
      return res.status(400).json({
        "Request status": "Failed",
        message: error.message,
      });
    }
    const { email, password, username } = req.body;
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn("User with the given credentials already exist!");
      return res.status(400).json({
        "Request status": "Failed",
        message: "User with the given credential exist",
      });
    }
    user = new User({
      username,
      email,
      password,
    });

    await user.save();
    logger.info(`New user ${user.username} is registered successfully`);

    res.status(201).json({
      "Request status": "Success",
      message: "User registered successfully",
    });
  } catch (error) {
    logger.error("Error registering new user", error);
    next(error);
  }
};

module.exports = registerUser;
