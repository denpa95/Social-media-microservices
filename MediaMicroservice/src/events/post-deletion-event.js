const Media = require("../model/media");
const { deleteMedia } = require("../utils/cloudinary");
const logger = require("../utils/winston-logger");

const handlePostDeletion = async (event) => {
  console.log(`Event: ${event}`);
  try {
    const { postId, userId, mediaIds } = event;
    //Find medias in database that has the same IDs as the medias in mediaIds(medias related to deleted post)
    const mediaToDelete = await Media.find({ _id: { $in: mediaIds } });
    for (const media of mediaToDelete) {
      await deleteMedia(media.publicId);
      await Media.findByIdAndDelete(media._id);
      logger.info(
        `Successfully deleted media ${media.originalName} from post ${postId} posted by ${userId}`,
      );
    }
  } catch (error) {
    logger.error(`Error deleting media from deleted post: ${error}`);
    throw error;
  }
};

module.exports = handlePostDeletion;
