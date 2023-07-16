const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({
        sucess: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: name,
      email,
      password: hashedPassword,
    });
    console.log(user);
    res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error in creating user in db",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exists sign up",
      });
    }

    if (await bcrypt.compare(password, existingUser.password)) {
      const token = jwt.sign(
        { email: existingUser.email, name: existingUser.fullName },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      existingUser.password = undefined;
      return res.status(200).json({
        success: true,
        existingUser,
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error while login",
    });
  }
};
