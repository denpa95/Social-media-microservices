const express = require("express");
const router = express.Router();
const authenticateRequest = require("../middlewares/authentication-middleware");
const createPost = require("../controller/create-post");
const getAllPosts = require("../controller/get-posts");
const getSinglePost = require("../controller/get-post-by-id");
const deletePost = require("../controller/delete-post");

//All incoming request must pass through user authentication middleware to check is user is logged in. Access is denied to post-microservice is user fails authentication.
router.use(authenticateRequest);

router.post("/create-post", createPost);
router.get("/all-posts", getAllPosts);
router.get("/get/:id", getSinglePost);
router.delete("/delete/:id", deletePost);

module.exports = router;
