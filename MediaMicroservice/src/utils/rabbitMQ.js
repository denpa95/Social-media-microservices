const amqp = require("amqplib");
const logger = require("./winston-logger");

let connection = null;
let channel = null;

const EXCHANGE_NAME = "facebook_events";

//Make connection to RabbitMQ server and create a channel
async function connectToRabbitMQ() {
  try {
    //Connect to RabbitMQ server, create a channel then assertExchange
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
  //If not channel detected, reconnect to RabbitMQ
  if (!channel) {
    await connectToRabbitMQ();
  }
  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message)),
  );
  logger.info(`Event published: ${routingKey}`);
}

async function consumeEvent(routingKey, eventHandler) {
  if (!channel) {
    await connectToRabbitMQ();
  }
  //Assert/create a temporary queue for consumption
  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, (message) => {
    if (message !== null) {
      const content = JSON.parse(message.content.toString());
      eventHandler(content);
      channel.ack(message);
    }
  });
  logger.info(`Subscribe to event: ${routingKey}`);
}

module.exports = { connectToRabbitMQ, publishEvent, consumeEvent };
