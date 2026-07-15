const multer = require("multer");

const upload = multer({
  //Memory storage engine stores file in memory as Buffer objects
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file"); //Upload a single file with the name "file".

module.exports = upload;
