const express = require("express");
const userRouter = express.Router();
const UserController = require('./userController');
const Auth = require("./auth");

//define routes
userRouter.post("/register", UserController.Register);
userRouter.post("/login", UserController.Login);
userRouter.post("/logout", Auth.isAuth, UserController.Logout);
userRouter.get("/me", Auth.isAuth, UserController.Me);
userRouter.post("/createTodo", Auth.isAuth, UserController.CreateTodo);
userRouter.get("/getTodos", Auth.isAuth, UserController.GetTodos);
userRouter.delete("/deleteTodo/:id", Auth.isAuth, UserController.DeleteTodo);

module.exports = userRouter;