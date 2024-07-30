const Router = require("express").Router();
const {
  createUser,
  loginUser,
  verifyOtp,
  resendOtp,
} = require("../Controller/UserController");
const multer = require("../Helper/MulterService");

Router.post("/create", multer, createUser);
Router.post("/verifyOtp", verifyOtp);
Router.post("/login", loginUser);
Router.post("/resendOtp", resendOtp);

module.exports = Router;
