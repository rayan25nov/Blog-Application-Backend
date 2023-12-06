import User from "../model/userModel.js";
import Otp from "../model/otpModel.js";
import Token from "../model/tokenModel.js";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import isvalidate from "validator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// @desc      Send OTP for email verification
// @route     POST /users/sendotp
// @access    Public // VERIFIED
const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ error: "User Already registered", success: false });
    }
    // Function to generate a random OTP of a specified length
    const generateOTP = (length) => {
      const alphabet = "0123456789abcdef";
      const nanoid = customAlphabet(alphabet, length);
      return nanoid();
    };

    // Example: Generate a 6-digit OTP
    const otp = generateOTP(6);
    console.log(otp);
    // Save OTP to database
    const otpData = new Otp({
      email,
      otp,
    });
    await otpData.save();
    // Send response to user
    res
      .status(200)
      .json({ success: true, message: "Otp sent successfully", otp });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
};

// @desc      SignUp a user
// @route     POST /users/signup
// @access    Public // VERIFIED
const signupHandler = async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body;
    console.log(otp);
    if (!email || !isvalidate.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email", success: false });
    }
    // find most recent otp
    const recentOtp = await Otp.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    // check if otp is valid
    if (!recentOtp) {
      // Otp not found
      return res.status(401).json({ error: "OTP not found", success: false });
    } else if (recentOtp.otp != otp) {
      // Otp is invalid
      return res.status(401).json({ error: "Invalid OTP", success: false });
    }
    // check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({
        error: "User already exists",
        success: false,
      });
    }

    console.log();
    let hashedPassword = "";
    if (password.length >= 6) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    const newUser = await user.save();
    // generate cookie
    const token = createToken({ id: newUser._id, role: newUser.role });
    res
      .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      .status(200)
      .json({
        message: "User created successfully",
        success: true,
        token,
      });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

const verifyToken = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.updateOne({ _id: user._id, verified: true });
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
// @desc      Login user
// @route     POST /users/login
// @access    Public  // VERIFIED
const signinHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        success: false,
      });
    }
    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        error: "Wrong password",
        success: false,
      });
    }
    // generate cookie
    const token = createToken({ id: user._id, role: user.role });
    res
      .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
      .status(200)
      .json({
        message: "User signed in successfully",
        success: true,
        token,
      });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

// @desc      Logout user
// @route     POST /users/logout
// @access    Public  // VERIFIED
const logoutHandler = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 }).status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (err) {
    res.status(400).json({ error: "Error while logging out", success: false });
  }
};

const maxAge = 3 * 24 * 60 * 60;

// Function to create a JWT token
const createToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// Function to handle errors
const handleErrors = (err) => {
  let errors = { name: "", email: "", password: "", role: "", otp: "" };

  // Check for missing fields
  if (err.name === "ValidationError") {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  // Duplicate email error
  if (err.code === 11000 && err.keyPattern.email) {
    errors.email = "That email is already registered";
  }

  // Custom error messages
  if (err.errors) {
    Object.values(err.errors).forEach(({ properties }) => {
      if (properties.message) {
        errors[properties.path] = properties.message;
      }
    });
  }

  // Filter out empty error messages
  return Object.keys(errors).reduce((acc, key) => {
    if (errors[key]) {
      acc[key] = errors[key];
    }
    return acc;
  }, {});
};

export { sendOtp, signupHandler, signinHandler, logoutHandler, verifyToken };
