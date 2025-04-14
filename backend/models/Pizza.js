const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    ingredients: { type: [String], required: true },
    image: { type: String, required: true },
    baseOptions: { type: [String], required: true },
    sauceOptions: { type: [String], required: true },
    cheeseOptions: { type: [String], required: true },
    veggieOptions: { type: [String], required: true },
    stock: { type: Number, required: true, default: 50 }  
});

const Pizza = mongoose.model("Pizza", pizzaSchema);
module.exports = Pizza;
