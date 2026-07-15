const express = require("express");
const multer = require("multer");
const router = express.Router();
const authenticateRequest = require("../middlewares/authentication-middleware");
const upload = require("../middlewares/multer");
const logger = require("../utils/winston-logger");
const uploadMedia = require("../controller/media-upload");
const getAllMedias = require("../controller/get-all-media");
const { endpointRateLimiter } = require("../middlewares/rate-limiter");

//Only authenticated user can upload and view medias.
router.use(authenticateRequest);

router.post(
  "/upload",
  endpointRateLimiter,
  (req, res, next) => {
    //Implement multer error-handling
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        logger.error(`Error uploading file through multer: ${err}`);
        return res.status(400).json({
          "Request status": "Failed",
          message: "Error uploading file through multer",
          error: err.message,
          errorDetails: err.stack,
        });
      } else if (err) {
        logger.err(`Unexpected error occured: ${err}`);
        return res.status(500).json({
          "Request status": "Failed",
          message: "An unexpected error occured",
          error: err.message,
          errorDetails: err.stack,
        });
      } else if (!req.file) {
        logger.error(`File is not attached in the request`);
        return res.status(400).json({
          "Request status": "Failed",
          message: "File was not attached to request! File upload failed.",
        });
      }
      next();
    });
  },
  uploadMedia,
);

router.get("/all-medias", getAllMedias);

module.exports = router;
