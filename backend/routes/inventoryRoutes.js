const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const Pizza = require("../models/Pizza"); 

// Get All Ingredients in Inventory
router.get("/", async (req, res) => {
  try {
    const inventory = await Inventory.find(); 
    res.json(inventory); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Add New Ingredient 
router.post("/", async (req, res) => {
  const { name, quantity, price, category } = req.body;

  if (!name || !quantity || !price || !category) {
    return res.status(400).json({ message: "Please provide name, quantity, price, and category." });
  }

  try {
    const newItem = new Inventory({ name, quantity, price, category });

    await newItem.save();

    res.json({ message: "Ingredient added successfully", newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add ingredient" });
  }
});


// Delete an Ingredient 
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.json({ message: "Ingredient deleted successfully", deletedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete ingredient" });
  }
});


// Update an Ingredient 
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, category } = req.body;

  if (!name && !quantity && !price && !category) {
    return res.status(400).json({ message: "Please provide at least one field to update." });
  }

  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { name, quantity, price, category }, 
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.json({ message: "Ingredient updated successfully", updatedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ingredient" });
  }
});


// Check if enough stock is available before updating 
router.post("/check-stock", async (req, res) => {
  const { pizzas } = req.body;

  if (!pizzas) {
    return res.status(400).json({ message: "Pizzas array is required." });
  }

  try {
    for (const item of pizzas) {
      const pizza = await Pizza.findById(item.pizzaId).populate("ingredients.name"); 

      if (pizza) {
        for (const ingredient of pizza.ingredients) {
          const inventoryItem = await Inventory.findOne({ name: ingredient.name });

          if (inventoryItem) {
            const requiredStock = ingredient.quantity * item.quantity;
            if (inventoryItem.quantity < requiredStock) {
              return res.status(400).json({
                message: `Not enough stock for ${ingredient.name}. Available: ${inventoryItem.quantity}, Required: ${requiredStock}`,
              });
            }
          } else {
            return res.status(400).json({ message: `Ingredient ${ingredient.name} not found in inventory.` });
          }
        }
      } else {
        return res.status(400).json({ message: `Pizza with ID ${item.pizzaId} not found` });
      }
    }

    res.status(200).json({ message: "Sufficient stock for all pizzas." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to check stock", error: err });
  }
});


// Update Ingredient Stock by Name
router.patch("/:ingredientName", async (req, res) => {
  console.log("[PATCH] Request Body:", req.body);

  const { ingredientName } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be a positive number" });
  }

  try {
    const ingredient = await Inventory.findOne({ name: new RegExp(`^${ingredientName}$`, "i") });

    console.log(`[PATCH] Looking for ingredient: '${ingredientName}'`);
    console.log(`[PATCH] Found Ingredient:`, ingredient);

    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    if (ingredient.quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    ingredient.quantity -= quantity;
    await ingredient.save();

    console.log(`✅ Updated '${ingredientName}' stock. New quantity: ${ingredient.quantity}`);
    res.status(200).json({ message: "Stock updated", ingredient });
  } catch (error) {
    console.error("❌ Error updating stock:", error.message || error);
    res.status(500).json({ error: "Stock update failed. Please try again." });
  }
});

module.exports = router;
