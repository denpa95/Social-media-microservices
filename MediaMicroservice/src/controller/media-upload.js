const logger = require("../utils/winston-logger");
const Media = require("../model/media");
const { uploadMediaToCloudinary } = require("../utils/cloudinary");

const uploadMedia = async (req, res, next) => {
  logger.info("User hit endpoint to upload media.");
  try {
    const { originalname, mimetype } = req.file;
    const { userId } = req.user;
    logger.info(
      `File to be uploaded: ${originalname} - ${mimetype} by user: ${userId}`,
    );
    //Upload media file into cloudinary
    const uploadResult = await uploadMediaToCloudinary(req.file);
    logger.info(
      `File uploaded to cloudinary successfully. File public ID - ${uploadResult.public_id}`,
    );
    //Save media file in database
    const newMedia = new Media({
      publicId: uploadResult.public_id,
      originalName: originalname,
      mimeType: mimetype,
      url: uploadResult.secure_url,
      userId,
    });
    await newMedia.save();
    res.status(201).json({
      "Request status": "Success",
      message: "Media uploaded successfully",
      mediaId: newMedia._id,
      url: newMedia.url,
    });
  } catch (error) {
    logger.error(`Error uploading media: ${error}.`);
    next(error);
  }
};

module.exports = uploadMedia;
