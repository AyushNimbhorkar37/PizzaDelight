const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is missing in environment variables!");
}

// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("🟡 User already exists with this email");
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            name,
            email,
            password, 
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            message: "User registered successfully!",
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });

    } catch (error) {
        console.error("❌ Error while registering user:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});



// LOGIN ROUTE
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find user in database
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ No user found with this email.");
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("❌ Passwords do not match.");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const userData = { id: user._id, name: user.name, email: user.email };

        res.status(200).json({
            message: "Login successful",
            token,
            user: userData, 
        });
    } catch (error) {
        console.error("❌ Error during login:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// FORGOT PASS ROUTE
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found with this email.");
      return res.status(404).json({ message: "No account found with this email." });
    }

    res.status(200).json({ message: "Reset link has been sent to your email address." });
  } catch (error) {
    console.error("❌ Error in forgot-password:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

