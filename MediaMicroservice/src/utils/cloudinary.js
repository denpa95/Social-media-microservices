require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const logger = require("./winston-logger");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//Upload media to Cloudinary using upload_stream which utilizes Node.js's stream functionality. It's useful when the file in storage is large and we don't want to load it to memory
const uploadMediaToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          logger.error(`Error uploading file to cloudinary: ${error}`);
          reject(error);
        }
        resolve(result);
      },
    );
    uploadStream.end(file.buffer);
  });
};

const deleteMedia = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(
      `Media successfully deleted from cloudinary. Media ID: ${publicId}`,
    );
    return result;
  } catch (error) {
    logger.error(`Error deleting media from cloudinary: ${error}`);
    throw error;
  }
};

module.exports = { uploadMediaToCloudinary, deleteMedia };
