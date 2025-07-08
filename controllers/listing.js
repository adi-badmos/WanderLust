const Listing = require("../models/listing");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New stay created!");
    let id = newListing._id;
    console.log("New home:")
    console.log(newListing);
    res.redirect(`/listings/${id}`);
};

module.exports.renderEditForm = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Requested stay does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log("Edited stay:");
    console.log(listing);
    req.flash("success", "Stay updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    console.log("Deleted stay:");
    console.log(listing);
    req.flash("success", "Stay deleted!");
    res.redirect("/listings");
};

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listing) {
        req.flash("error", "Requested stay does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};