const mongoose = require("mongoose");
const logger = require("./winston-logger");

const connectToMongoDB = async() => {
  logger.info("Search microservice is attempting a connection with MongoDB...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Search microservice is now successfully connected to MongoDB.")

  } catch(error) {
    logger.error(`Error connecting with MongoDB: ${error}`);
    process.exit(1);
  }
}

module.exports = connectToMongoDB;