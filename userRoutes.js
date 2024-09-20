const express = require("express");
const userRouter = express.Router();
const UserController = require('./userController');
const Auth = require("./auth");

//define routes
userRouter.post("/register", UserController.Register);
userRouter.post("/login", UserController.Login);

module.exports = userRouter;