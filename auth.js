const jwt = require("jsonwebtoken");
const config = require("./config");
const user = require("./userModel");

const auth = {
    isAuth: async (req, res, next) => {
        const token = req.cookies.token;
        //if token is not present throw error
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        //verify token
        try {
            const decodedToken = jwt.verify(token, config.JWT_secret)

            //get user from token
            req.userId = decodedToken.id;

            next();
        }
        catch (error) {
            return res.status(500).json({ message: "Unauthorized" });
        }
    }
}

//export module
module.exports = auth