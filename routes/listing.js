const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

// Route: "/"
router.route("/")
.get(wrapAsync(listingController.index)) // Index Route
.post(isLoggedIn, validateListing, wrapAsync(listingController.createListing)); // Create Route

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Route: "/:id"
router.route("/:id")
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing)) // Update Route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)) // Delete Route
.get(wrapAsync(listingController.showListing)); // Show Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;