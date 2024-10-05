const jwt = require("jsonwebtoken");
const config = require("./config");
const user = require("./userModel");

const auth = {
    isAuth: async (req, res, next) => {
        // Check for the token in the Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        try {
            const decodedToken = jwt.verify(token, config.JWT_secret);
            req.userId = decodedToken.id;  // Attach user ID to request object
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    }
    }
//export module
module.exports = auth