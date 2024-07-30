require("dotenv").config();
const mongoose = require("mongoose");
const URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(URL);

    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
