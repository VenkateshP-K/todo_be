const jwt = require("jsonwebtoken");
const config = require("./config");
const user = require("./userModel");

const auth = {
    isAuth: async (req, res, next) => {
        const token = req.cookies.token;  // Extract token from cookies
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        try {
            const decodedToken = jwt.verify(token, config.JWT_secret);  // Decode the token
            req.userId = decodedToken.id;  // Set userId to request object
            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
}

//export module
module.exports = auth