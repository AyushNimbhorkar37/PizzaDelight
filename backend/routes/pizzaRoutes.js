const express = require("express");
const Pizza = require("../models/Pizza");

const router = express.Router();

// GET all pizzas with customization options
router.get("/", async (req, res) => {
    try {
        const pizzas = await Pizza.find();
        res.json(pizzas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
