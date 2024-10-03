const jwt = require("jsonwebtoken");
const config = require("./config");
const user = require("./userModel");

const auth = {
    isAuth: async (req, res, next) => {
        const token = req.cookies.token;
        console.log("Token from cookies:", token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        try {
            const decodedToken = jwt.verify(token, config.JWT_secret);
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