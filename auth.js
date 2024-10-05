const jwt = require("jsonwebtoken");
const config = require("./config");
const user = require("./userModel");

const auth = {
    isAuth: async (req, res, next) => {
        try {
            // get the token from the request cookies
            const token = req.cookies.token;

            // if the token is not present, return an error message
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // verify the token
            try {
                const decodedToken = jwt.verify(token, config.JWT_secret);

                // get the user id from the decoded token and 
                // attach it to the request object
                req.userId = decodedToken.id;

                // call the next middleware
                next();
            } catch (error) {
                res.status(401).json({ message: 'invalid token' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });  
        }
}
}

//export module
module.exports = auth