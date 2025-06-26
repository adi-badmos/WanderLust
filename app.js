// requiring needed libraries, frameworks, etc.
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const listingRouter = require("./routes/listing.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// required

// Connecting to the Database
// const mong = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to Database");
    }) .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbURL);
}
// connected

// ejs files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Root page
app.get("/", (req, res) => {
    res.send("Welcome to the root page");
});

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*60*60,
});

store.on("error", () => {
    console.log("Error in Mongo Session Store");
});

app.use(session({
    store,
    secret: "thisshouldbeabettersecret", // use a strong secret in production
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listingRouter);
app.use("/", userRouter);

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server Connected");
});