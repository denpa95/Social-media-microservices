const Post = require("../model/post");
const logger = require("../utils/winston-logger");

const getAllPosts = async (req, res, next) => {
  logger.info("Incoming request to fetch all posts.");
  try {
    //Implement pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    //startIndex works as an identifier for how many documents and which documents to fetch for particular page
    const startIndex = (page - 1) * limit;

    //Implement caching for post fething to reduce response time
    //Create cache key
    const cacheKey = `posts:${page}:${limit}`;
    //Search for key in Redis server is it exist(already cached). If yes, retrieve result from cache
    const cachedResult = await req.redisClient.get(cacheKey);
    if (cachedResult) {
      logger.info("Data fetched from Redis cache.");
      return res.json(JSON.parse(cachedResult));
    }
    //Else fetch data from database sorted by new posts first
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    //Count total documents in collection for pagination
    const totalPosts = await Post.countDocuments();

    const result = {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    };

    //Save result in Redis cache with a TTL of 10 mins
    await req.redisClient.setex(cacheKey, 600, result);

    //Send reponse to client
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error fetching all posts: ${error}`);
    next(error);
  }
};

module.exports = getAllPosts;
