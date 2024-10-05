const jwt = require("jsonwebtoken");
const config = require("./config");
const user = require("./userModel");

const auth = {
    isAuth: async (req, res, next) => {
        const token = req.cookies.token || req.headers['authorization'];
        console.log("Received token:", token);  // To check if the token is received in the console

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        try {
            // Remove 'Bearer ' prefix if token comes from Authorization header
            const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
            const decodedToken = jwt.verify(cleanToken, config.JWT_secret);  // Verify token
            console.log("Decoded token:", decodedToken);
            req.userId = decodedToken.id;  // Attach the decoded user ID to the request
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    }
}

//export module
module.exports = auth