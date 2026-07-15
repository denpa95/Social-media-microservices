const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: "api-gateway" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.errors({ stack: true }),
      ),
    }),
    new winston.transports.File({
      filename: "api-gateway-error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "api-gateway-combinedLogs.log",
    }),
  ],
});

module.exports = logger;
