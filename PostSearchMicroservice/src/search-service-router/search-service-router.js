const express = require("express");
const router = express.Router();
const authenticateRequest = require("../middlewares/authentication-middleware");
const searchPost = require("../controllers/search-post");

router.use(authenticateRequest);

router.get("/posts", searchPost);

module.exports = router;
