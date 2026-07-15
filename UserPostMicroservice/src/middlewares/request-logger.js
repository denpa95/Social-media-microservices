const logger = require("../utils/winston-logger");

const requestLogger = async (req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}.`);
  logger.info(req.body ? req.body : "No data body present in request.");
  next();
};

module.exports = requestLogger;
