const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pizzas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pizza", required: true }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
