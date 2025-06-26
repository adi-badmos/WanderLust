const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

// to print all data from the database
// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    })
);

// New Route
router.get("/new", isLoggedIn, wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
    })
);

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if(!listing) {
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
    })
);

// Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    res.redirect("/listings");
    })
);

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
    })
);

// Update Route
router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
    })
);

// Delete Route
router.delete("/:id", isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings/");
    })
);

module.exports = router;