const mongoose = require("mongoose");
const logger = require("./winston-logger");

const connectToMongoDB = async () => {
  logger.info("Identity microservice is attempting a connection to MongoDB....");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Identity microservice is now successfully connected to MongoDB.");
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1); //Stops the app immediately, doesn't handle anymore requests
  }
};

module.exports = connectToMongoDB;
