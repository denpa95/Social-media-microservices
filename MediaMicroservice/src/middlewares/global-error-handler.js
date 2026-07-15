const logger = require("../utils/winston-logger");

const errorHandler = (err, req, res, next) => {
  logger.error("Unknown error occured", err);
  res.status(err.status || 500).json({
    "Request status": "Failed",
    message: err.message, //|| "Internal server error",
  });
}; 

module.exports = errorHandler;