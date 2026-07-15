const express = require("express");
const registerUser = require("../controller/register-user");
const loginUser = require("../controller/login-user");
const refreshTokenEndpoint = require("../controller/refresh-token-endpoint");
const logoutUser = require("../controller/logout-user");
const router = express.Router();
const { endpointRateLimiter } = require("../middlewares/rate-limiter");

router.post("/register", endpointRateLimiter, registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshTokenEndpoint);
router.post("/logout", logoutUser);

module.exports = router;
