const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,  
      enum: ["pizzaBase", "sauce", "cheese", "toppings"],  
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
