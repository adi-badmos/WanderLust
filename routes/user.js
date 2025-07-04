const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => {
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        } res.redirect("/listings");
    })
    console.log(registeredUser);
    })
);

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login'}), async(req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        } res.redirect("/listings");
    })
})

module.exports = router;