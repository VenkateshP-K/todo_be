const User = require("./userModel");
const Todo = require("./todoModel");
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

    //login a user
    Login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Unauthorized User" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const token = jwt.sign({ id: user._id }, config.JWT_secret,);
            res.cookie('token', token, {
                 httpOnly: true,
                 secure : true,
                 sameSite : 'none',
                 MaxAge : new Date(Date.now() + 24 * 60 * 60 * 1000)});
            res.status(200).json({ message: 'Logged in successfully', user, token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    //get logged in user
    Me: async (request, response) => {
        try {
            // get the user id from the request object
            const userId = request.userId;

            // find the user by id from the database
            const user = await User.findById(userId).select('-passwordHash -__v -_id');

            // if the user does not exist, return an error message
            if (!user) {
                return response.status(400).json({ message: 'user not found' });
            }

            // return the user details
            response.status(200).json({ user });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    },
    
    //logout function
    logout: async (request, response) => {
        try {
            // clear the token cookie
            response.clearCookie('token');

            // return a success message
            response.status(200).json({ message: 'logout successful' });
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    },

    //create a todo
    CreateTodo: async (req, res) => {
        try {
            const { title, description } = req.body;
            const userId = req.userId;
            const todo = new Todo({
                title,
                description,
                userId
            });
            await todo.save();
            res.status(201).json({ message: 'Todo created successfully', todo });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //get all todos
    GetTodos: async (req, res) => {
        try {
            const userId = req.userId;
            const todos = await Todo.find({ userId });
            res.status(200).json({ todos });
        } catch (error) {   
            res.status(500).json({ message: error.message });
        }
    },

    //delete a todo
    DeleteTodo : async (req,res) => {
        try{
            const todoId = req.params.id;
            const todo = await Todo.findByIdAndDelete(todoId);
            if(!todo){
                return res.status(404).json({ message: 'Todo not found' });
            }
            res.status(200).json({ message: 'Todo deleted successfully' });
        }
        catch(error){   
            res.status(500).json({ message: error.message });
        }
    }
}

//export module
module.exports = UserController;