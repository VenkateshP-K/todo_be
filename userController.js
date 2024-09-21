const User = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("./config");

const UserController = {
    //register a user
    Register: async (req, res) => {
        console.log("Request received on /register")
        try {
            const { userName, email, password } = req.body;
            const user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ message: "User already exists" });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new User({
                userName,
                email,
                password: passwordHash
            });

            await newUser.save();
            res.status(201).json({ message: "User created successfully", user: newUser });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //login function
    Login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign({ id: user._id }, config.JWT_secret, { expiresIn: "24h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000
            });

            res.status(200).json({ message: "User logged in successfully", token, user: { id: user._id, name: user.userName } });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //get the current user
    Me: async (req, res) => {
       try{
        //get the user id from the req object
        const userId = req.userId;

        //find the user id from db
        const user = await User.findById(userId);

        //if the user is not found
        if(!user){
            return res.status(500).json({ message: "User not found" });
        }

        //return the user
        res.status(200).json({ user });
       }
       catch(error){
        res.status(500).json({ message: error.message });
       }
    },

    //logout function
    Logout: async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Error in logout:', error);
            res.status(500).json({ message: error.message });
        }
    }
}

//export module
module.exports = UserController;