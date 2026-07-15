const Post = require("../model/post");
const logger = require("../utils/winston-logger");
const { validatePostId } = require("../utils/user-data-validation");

const getSinglePost = async (req, res, next) => {
  logger.info("Incoming request to fetch post by given ID");
  try {
    const { error } = validatePostId(req.params.id);
    if (error) {
      logger.warn(`Post ID validation error: ${error.details[0].message}`);
      return res.status(400).json({
        "Request status": "Success",
        message: `Invalid post ID: ${error.details[0].message}`,
      });
    }
    const postId = req.params.id;
    //Implement post caching to reduce response time
    //Create cache key
    const cacheKey = `post:${postId}`;
    //Check if data has already been cached and return in result
    const cachedPost = await req.redisClient.get(cacheKey);
    if (cachedPost) {
      logger.info("Data is fetched from Redis cache.");
      return res.status(200).json(JSON.parse(cachedPost));
    }
    //Fetch data from database if not cached yet
    const post = await Post.findById(postId);
    if (!post) {
      logger.warn(`Post with the given ID is not found`);
      return res.status(404).json({
        "Request status": "Failed",
        message: "Invalid post ID! Please try again with a valid ID",
      });
    }
    //Save data in cached
    await req.redisClient.setex(cacheKey, 600, JSON.stringify(post));

    //Send response to client
    res.status(200).json(post);
  } catch (error) {
    logger.error(`Error fetching post: ${error}`);
    next(error);
  }
};

module.exports = getSinglePost;
