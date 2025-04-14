const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Listing = require("./models/listing.js"); 
const User = require("./models/User.js"); 

dotenv.config(); 

const MONGO_URL = process.env.MONGO_URI || "your-mongodb-connection-string";

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB Atlas - pizza-app"))
  .catch((err) => {
      console.error("❌ MongoDB Connection Error:", err);
      process.exit(1);
  });

// Function to seed an admin user
const seedAdmin = async () => {
    try {
        const adminEmail = "admin@example.com";  
        const adminPassword = "Admin@123";  

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("✅ Admin already exists");
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const adminUser = new User({
                name: "Admin User",
                email: adminEmail,
                password: hashedPassword,
                isAdmin: true,
                isVerified: true
            });
            await adminUser.save();
            console.log("✅ Admin user created successfully!");
        }
    } catch (error) {
        console.error("❌ Error seeding admin user:", error);
    }
};

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("✅ Database initialized successfully");
    } catch (error) {
        console.error("❌ Error initializing database:", error);
    }
};

const startSeeding = async () => {
    await initDB();
    await seedAdmin();
    mongoose.connection.close(); 
};

startSeeding();
