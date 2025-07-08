require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log(err);
});

async function main () {
    await mongoose.connect(dbUrl);
};

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "686a61dd0e3514c14ef0dd7c"})),
    await Listing.insertMany(initData.data);
    console.log("Database was initialized");
}

initDB();