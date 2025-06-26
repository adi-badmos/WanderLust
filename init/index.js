const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Connecting to the Database
const mong = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("Connected to Database");
    }) .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mong);
}
// connected

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68381adc489c57cd28baf2b0"}));
    await Listing.insertMany(initData.data);
    console.log("Initialised Database");
};

initDB();