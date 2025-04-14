const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied! No token provided." });
        }

        // Extract the token (format: "Bearer <token>")
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 

        next(); 
    } catch (error) {
        console.error("❌ Authentication Error:", error);
        res.status(401).json({ message: "Invalid or expired token!" });
    }
};

module.exports = authMiddleware;
