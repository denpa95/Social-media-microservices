const Search = require("../model/search");
const logger = require("../utils/winston-logger");

const searchPost = async (req, res, next) => {
  logger.info("Incoming request from user to search-post endpoint.");
  try {
    //Retrieve "query" from URL. For eg. http://localhost:3003/api/search/posts?query=denpa. Query here is "denpa"
    const query = req.query.query.trim();
    //Create cache key and search for data in Redis cache
    const cacheKey = `search:${query}`;
    const cacheResult = await req.redisClient.get(cacheKey);
    if (cacheResult) {
      logger.info(`Search result is fetched from cache.`);
      return res.status(200).json(JSON.parse(cacheResult));
    }
    //Data not found in cache, procees to fetch data from database
    const result = await Search.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      },
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);
    //Cache result in Redis server
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Error searching for post: ${error}`);
    next(error);
  }
};

module.exports = searchPost;
