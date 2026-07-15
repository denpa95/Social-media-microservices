const mongoose = require("mongoose");
const logger = require("./winston-logger");

const connectToMongoDB = async () => {
  logger.info("Post microservice is now attempting a connection to MongoDB...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Post microservice is now successfully connected to MongoDB.");
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

module.exports = connectToMongoDB;
