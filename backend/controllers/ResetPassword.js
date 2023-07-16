const User = require("../models/User");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.find({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn not exist",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const updatedDetails = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordToken: Date.now() + 3600000,
      },
      {
        new: true,
      }
    );

    console.log("Updated Details ", updatedDetails);

    const url = `http://localhost:5500/resetPassword.html?token=${token}`;

    await mailSender(
      email,
      "Password reset",
      `Your link for email verification is ${url}. Please click the link to reset password`
    );

    res.json({
      success: true,
      message: "Email sent successfully. Please check your email",
    });
  } catch (error) {
    res.json({
      error: error.message,
      success: false,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist .Signup",
      });
    }

    if (user.resetPasswordExpires > Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token is expired. Please regenerate",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { token },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error in reseting password",
    });
  }
};
