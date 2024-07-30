require("dotenv").config();
const crypto = require("crypto");
const User = require("../Model/Users");
const jsonToken = require("jsonwebtoken");
const mailSender = require("../Helper/MailSender");
const multer = require("multer");
const os = require("os");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res.status(403).json({
          error: true,
          message: "Email already exists",
        });
      }

      const otp = crypto.randomInt(1000, 9999);
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      user.otp = otp;

      await user.save();

      await mailSender(email, otp, name);

      return res.status(200).json({
        error: false,
        message: "A new OTP has been sent to your email.",
      });
    }

    multer(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          error: true,
          message: "File upload error: " + err.message,
        });
      }
    });

    const otp = crypto.randomInt(9999);
    const otpExpire = Date.now() + 4 * 60 * 1000;

    const newUser = await User.create({
      otp,
      name,
      email,
      password,
      otpExpires: otpExpire,
      profileImage: req.file ? req.file.path.replace(/\\/g, "/") : "",
    });

    await mailSender(res, email, otp, name);

    res.status(200).json({
      User: newUser,
      error: false,
      id: newUser._id,
      message:
        "User created successfully. A verification OTP has been sent to your email.",
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user = await User.findOne({
      otp,
      email,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid OTP or OTP is expired.",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({
      error: false,
      id: User._id,
      message: "User verified successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || (user && !user.isVerified)) {
      return res.status(400).json({
        error: true,
        message: "User doesn't exists",
      });
    } else if (user.email !== email || user.password !== password) {
      return res.status(403).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    const token = jsonToken.sign({ email, id: user._id }, process.env.JWT_key, {
      expiresIn: "1h",
    });

    res.status(200).json({
      error: false,
      token,
      id: user._id,
      message: "User logged in successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User not found",
      });
    }

    const otp = crypto.randomInt(9999);
    const otpExpire = Date.now() + 600000;

    await mailSender(res, email, otp, "User");

    user.otp = otp;
    user.otpExpires = otpExpire;

    await user.save();

    res.status(200).send({
      error: false,
      message: "OTP resent successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  verifyOtp,
  resendOtp,
};
