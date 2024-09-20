const User = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("./config");

const UserController = {
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
    Login : async (req, res) => {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(401).json({message: "Invalid email or password"});
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if(!isMatch){
                return res.status(401).json({message: "Invalid email or password"});
    }

           const token = jwt.sign({id: user._id}, config.JWT_secret, {expiresIn: "24h"});

           res.cookie("token", token, {
            httpOnly: true,
            secure : true,
            sameSite: "none",
            maxAge : 24 * 60 * 60 * 1000});

           res.status(200).json({message: "User logged in successfully", token, user: {id: user._id, name: user.name, email: user.email}});
        } catch (error) {
            res.status (500).json({message: error.message});
        }
    }
}

//export module
module.exports = UserController;