const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ timestamp: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: "post-search-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.errors({ timestamp: true }),
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: "post-search-error.log"
    }),
    new winston.transports.File({
      filename: "post-search-combined-logs.log"
    })
  ],
});


module.exports = logger;