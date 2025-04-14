const express = require("express");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

const router = express.Router();

// POST - Place an order 
router.post("/", async (req, res) => {
  // try {
  //   const { user, pizzas, address, paymentId, paymentStatus } = req.body;

  //   if (!user || !pizzas || !address || !paymentId || !paymentStatus) {
  //     return res.status(400).json({ message: "Missing required fields" });
  //   }

  //   const inventoryUpdates = {};

  //   for (const item of pizzas) {
  //     const toppings = item.selectedToppings || [];

  //     for (const topping of toppings) {
  //       const toppingName = typeof topping === "string" ? topping : topping.name;
  //       const nameRegex = new RegExp(`^${toppingName.trim()}$`, "i");

  //       // const inventoryItem = await Inventory.findOne({ name: nameRegex });

  //       if (!inventoryItem) {
  //         console.error(`❌ Ingredient not found: ${toppingName}`);
  //         return res.status(400).json({ message: `Ingredient "${toppingName}" not found in inventory.` });
  //       }

  //       if (inventoryItem.quantity < 1) {
  //         return res.status(400).json({
  //           message: `Not enough stock for "${toppingName}". Only ${inventoryItem.quantity} left.`,
  //         });
  //       }

  //       // Decrease quantity
  //       inventoryItem.quantity -= 1;
  //       inventoryUpdates[inventoryItem._id] = inventoryItem;
  //     }
  //   }

  //   // Save inventory updates
  //   for (const id in inventoryUpdates) {
  //     await inventoryUpdates[id].save();
  //   }

  //   // Save the order
  //   const order = new Order({
  //     user,
  //     pizzas,
  //     address,
  //     paymentId,
  //     paymentStatus,
  //     totalAmount: 0, // Optional: calculate total from prices if needed
  //   });

  // await order.save();

  res.status(201).json({ message: "Order placed successfully!" });
  // } catch (error) {
  //   console.error("❌ Error placing order:", error);
  //   res.status(500).json({ message: "Error placing order", error: error.message });
  // }
});

// GET - Fetch all orders
router.get("/", async (req, res) => {
  // try {
  //   // const orders = await Order.find()
  //     .populate("user", "name email")
  //     .populate("pizzas");
  //   res.json(orders);
  // } catch (error) {
  //   console.error("Error fetching orders:", error);
  //   res.status(500).json({ message: "Error fetching orders", error: error.message });

  // }
  res.status(201).json({ message: "Order placed successfully!" });
});

module.exports = router;
