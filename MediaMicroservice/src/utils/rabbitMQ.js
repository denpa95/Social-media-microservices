const amqp = require("amqplib");
const logger = require("./winston-logger");

let connection = null;
let channel = null;

const EXCHANGE_NAME = "facebook_events";

//Make connection to RabbitMQ server and create a channel
async function connectToRabbitMQ() {
  while (true) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, "topic", {
        durable: false,
      });
      logger.info("Successfully connected to RabbitMQ server.");
      // Break from loop once connection is successful
      break;
    } catch (error) {
      logger.error(`Error connecting to RabbitMQ: ${error}`);
      logger.error("Retrying connecting to RabbitMQ in 15 seconds");
      // Promise to delay next connection attempt by 5 seconds
      await new Promise((res) => {
        setTimeout(res, 15000);
      });
    }
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
    console.log(
      "No channel is found to listen to incoming event from Post microservice",
    );
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
