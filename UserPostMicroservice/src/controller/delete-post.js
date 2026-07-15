const Post = require("../model/post");
const logger = require("../utils/winston-logger");
const { validatePostId } = require("../utils/user-data-validation");
const invalidateCache = require("../utils/invalidate-cache");
const { publishEvent } = require("../utils/rabbitMQ");

const deletePost = async (req, res, next) => {
  logger.info("Incoming request to delete post with the given ID.");
  try {
    const { error } = validatePostId(req.params.id);
    if (error) {
      logger.warn(`Post ID validation error: ${error.details[0].message}`);
      return res.status(400).json({
        "Request status": "Failed",
        message: `Invalid post ID: ${error.details[0].message}`,
      });
    }
    const postId = req.params.id;
    const { userId } = req.user;
    const post = await Post.findByIdAndDelete({ _id: postId, user: userId });
    if (!post) {
      logger.warn(
        `Post with the given ID does not exist. It might be have been deleted. Please try again.`,
      );
      return res.status(404).json({
        "Request status": "Failed",
        message:
          "Post with the given ID doesn't exist or might have been deleted.",
      });
    }
    //Publish event to Media microservice to delete all media related to this post. Routing key: "post:deleted"
    await publishEvent("post:deleted", {
      postId: post._id.toString(),
      userId: userId,
      mediaIds: post.mediaIds,
    });
    //Delete all data from cache
    await invalidateCache(req, post._id.toString());
    res.json({
      "Request status": "Success",
      message: "Post deleted successfully.",
    });
  } catch (error) {
    logger.error(`Error deleting post with the given ID: ${error}`);
    next(error);
  }
};

module.exports = deletePost;
