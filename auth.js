const jwt = require("jsonwebtoken");
const config = require("./config");
const user = require("./userModel");

const auth = {
    isAuth: async (req, res, next) => {
        const token = req.cookies.token || req.headers['authorization'];
        console.log("Received token:", token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        try {
            const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
            const decodedToken = jwt.verify(cleanToken, config.JWT_secret);
            console.log("Decoded token:", decodedToken);
            req.userId = decodedToken.id;
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    }
    }
//export module
module.exports = auth