const Media = require("../model/media");
const logger = require("../utils/winston-logger");

const getAllMedias = async (req, res, next) => {
  logger.info(`User hit endpoint to fetch all available medias.`);
  try {
    const medias = await Media.find({});
    res.status(200).json({
      "Request status": "Success",
      result: medias,
    });
  } catch (error) {
    logger.error(`Error fetching all medias: ${error}`);
    next(error);
  }
};

module.exports = getAllMedias;
