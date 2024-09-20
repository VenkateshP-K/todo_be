const jwt = require("jsonwebtoken");
const config = require("./config");
const  User  = require("./userModel");

const Auth = {
    isAuth : async (req, res, next) => {
        const token = req.headers["x-access-token"];
        if (!token) {
            return res.status(401).send({ auth: false, message: "UnAuthorized User" });
        }
        try {
            const decoded = jwt.verify(token, config.secret);
            req.userId = decoded.id;
            next();
        } catch (err) { 
            return res.status(401).send({ auth: false, message: err.message});
        }
    }
}

module.exports = Auth;