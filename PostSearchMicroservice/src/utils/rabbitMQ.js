const amqp = require("amqplib");
const logger = require("./winston-logger");

let connection = null;
let channel = null;

const EXCHANGE_NAME = "facebook_events";

/*
async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
    logger.info("Successfully connected to RabbitMQ");
  } catch (error) {
    logger.error(`Error connecting to RabbitMQ server: ${error}`);
  }
} */

async function connectToRabbitMQ() {
  try {
    while (true) {
      console.log(
        `Waiting for RabbitMQ to perform healthchecks and successfully start.`,
      );
      await new Promise((res) => setTimeout(res, 15000));
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
      logger.info("Successfully connected to RabbitMQ");
      break;
    }
  } catch (error) {
    logger.error(`Error connecting to RabbitMQ: ${error}`);
    if (error.stack.includes("ECONNREFUSED")) {
      console.log(`Retrying connection...`);
    }
  }
}

async function consumeEvent(routingKey, eventHandler) {
  if (!channel) {
    await connectToRabbitMQ();
  }
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, (message) => {
    if (message !== null) {
      const content = JSON.parse(message.content.toString());
      eventHandler(content);
      channel.ack(message);
    }
  });
}

module.exports = { connectToRabbitMQ, consumeEvent };
