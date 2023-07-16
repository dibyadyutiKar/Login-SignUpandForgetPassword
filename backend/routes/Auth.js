const express = require("express");
const router = express.Router();

const { login, signup } = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

router.post("/login", login);
router.post("/signup", signup);
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/resetPassword", resetPassword);

module.exports = router;
