const express = require("express");
const userRouter = express.Router();
const UserController = require('./userController');
const Auth = require("./auth");

//define routes
userRouter.post("/register", UserController.Register);
userRouter.post("/login", UserController.Login);
userRouter.post("/logout", Auth.isAuth, UserController.Logout);
userRouter.get("/me", Auth.isAuth, UserController.Me);

module.exports = userRouter;