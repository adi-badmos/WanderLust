const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");
const userController = require("../controllers/users.js");

// Users
// SignUp
// Route: "/signup"
router.route("/signup")
.get(userController.renderSignUpForm)
.post(saveRedirectUrl, wrapAsync(userController.signup));

// Login
// Route: "/login"
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), wrapAsync(userController.login));

// passport.authenticate(): passport ka ek middleware h jo ki authentication ke liye use hota h
// It will check whether the entered user exists or not

// Logout
router.get("/logout", userController.logout);

router.use((req, res, next) => {
    next(); // allow 404 handler in app.js to run
});

module.exports = router;