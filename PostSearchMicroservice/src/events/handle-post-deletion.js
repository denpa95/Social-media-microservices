const logger = require("../utils/winston-logger");
const Search = require("../model/search");
const invalidateSearchCache = require("../utils/invalidate-cache");

const handlePostDeletion = async (event, redisClient) => {
  try {
    const { postId } = event;
    const post = await Search.findOneAndDelete({ postId: postId });
    await invalidateSearchCache(redisClient);
    console.log(post);
    logger.info(
      `Successfully deleted post ${post.postId} from search service.`,
    );
  } catch (error) {
    logger.error(`Error handling post deletion: ${error}`);
    throw error;
  }
};

module.exports = handlePostDeletion;
