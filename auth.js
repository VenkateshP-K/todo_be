const jwt = require("jsonwebtoken");
const config = require("./config");
const user = require("./userModel");

const auth = {
        isAuth: async (req, res, next) => {
            const token = req.cookies.token;  // Extract token from cookies
            console.log("Token from cookies:", token);  // Add this log to inspect token
    
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            
            try {
                const decodedToken = jwt.verify(token, config.JWT_secret);  // Decode the token
                console.log("Decoded token:", decodedToken);  // Log decoded token for inspection
    
                req.userId = decodedToken.id;  // Set userId to request object
                next();
            } catch (error) {
                console.error("Token verification error:", error);  // Add this to catch token issues
                return res.status(401).json({ message: "Unauthorized" });
            }
        }
    }
    

//export module
module.exports = auth