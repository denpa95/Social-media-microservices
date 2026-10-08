const amqp = require("amqplib");
const logger = require("../utils/winston-logger");

let connection = null;
let channel = null;

const EXCHANGE_NAME = "facebook_events";

async function connectToRabbitMQ() {
  try {
    while (true) {
      logger.info(
        `Waiting for RabbitMQ to perform healthchecks and start successfully,`,
      );
      await new Promise((resolve) => {
        setTimeout(resolve, 15000);
      });
      logger.info(`Connecting to RabbitMQ now...`);
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
      logger.info(`Successfully connected to RabbitMQ.`);
      break;
    }
  } catch (error) {
    logger.error(`Error connecting to RabbitMQ: ${error}`);
    if (error.stack.includes("ECONNREFUSED")) {
      logger.info("Retrying connection to RabbitMQ");
    }
  }
}

async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "topic", {
      durable: false,
    });
    logger.info("Successfully connected to RabbitMQ server");
  } catch (error) {
    logger.error(`Error connecting to RabbitMQ server: ${error}`);
  }
}

async function publishEvent(routingKey, message) {
  if (!channel) {
    console.log("Channel not found! Creating a new channel.");
    await connectToRabbitMQ();
  }
  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message)),
  );
  logger.info(`Event published: ${routingKey}`);
}

module.exports = { connectToRabbitMQ, publishEvent };
