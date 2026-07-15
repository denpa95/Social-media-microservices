const Post = require("../model/post");
const logger = require("../utils/winston-logger");
const { validatePostCreationData } = require("../utils/user-data-validation");
const { publishEvent } = require("../utils/rabbitMQ");

const createPost = async (req, res, next) => {
  logger.info("Incoming request for new post creation.");
  try {
    const { error } = validatePostCreationData(req.body);
    if (error) {
      logger.warn(`Data validation error: ${error.details[0].message}`);
      return res.status(400).json({
        "Request status": "Failed",
        message: error.details[0].message,
      });
    }
    const { content, mediaIds } = req.body;
    const newPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });
    await newPost.save();

    //Publish post creation event to be consumed by PostSearchMicroservice
    await publishEvent("post:created", {
      postId: newPost._id.toString(),
      userId: newPost.user.toString(),
      content: newPost.content,
      createdAt: newPost.createdAt,
    });

    await res.status(201).json({
      "Request status": "Success",
      message: "Successfully created new post",
    });
  } catch (error) {
    logger.error(`Error creating new post: ${error}`);
    next(error);
  }
};

module.exports = createPost;
