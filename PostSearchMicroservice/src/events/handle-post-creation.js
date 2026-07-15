const logger = require("../utils/winston-logger");
const Search = require("../model/search");
const invalidateSearchCache = require("../utils/invalidate-cache");

//Create new Search record in database each time new post is created. Invalidate cache also.
const handlePostCreation = async (event, redisClient) => {
  try {
    const { postId, userId, content, createdAt } = event;
    const newSearch = new Search({
      postId,
      userId,
      content,
      createdAt,
    });
    await newSearch.save();
    await invalidateSearchCache(redisClient);
    logger.info(
      `Successfully added newly created post: ${newSearch.postId} to search service.`,
    );
  } catch (error) {
    logger.error(`Error handling post creation error: ${error}`);
    throw error;
  }
};

module.exports = handlePostCreation;
