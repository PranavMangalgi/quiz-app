const express = require("express");
const router = express.Router();
const cookieAuth = require("../middlewares/cookieAuth");
const {
  handleSignUp,
  handleLogin,
  handleUserData,
  handleAnalytics,
} = require("../controllers/authController");

router.post("/signup", handleSignUp);

router.post("/login", handleLogin);

//api for dashboard data
router.get("/userdata", cookieAuth, handleUserData);

//analytics data
router.get("/analytics", cookieAuth, handleAnalytics);

module.exports = router;
