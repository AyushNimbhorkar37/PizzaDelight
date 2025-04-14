const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
