import User from "../model/userModel.js";
import Token from "../model/tokenModel.js";
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import cloudinaryMiddleware from "../middleware/cloudinaryMiddleware.js";

// @desc      SignUp a user
// @route     POST /users/signup
// @access    Public // VERIFIED
const signupHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (validator.isEmail(email) === false) {
      return res.status(400).json({
        errors: { email: "Invalid Email" },
        success: false,
      });
    }
    // check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({
        errors: { user: "User already exists" },
        success: false,
      });
    }
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
    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}users/${newUser.id}/verify/${token.token}`;
    await mailSender(
      newUser.email,
      "To complete your registration, please verify your email address by clicking the button below:",
      url,
      "Verify Email"
    );

    res
      .status(201)
      .send({ message: "An Email sent to your account please verify" });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors, success: false });
  }
};

// @desc      Verify user
// @route     GET /users/:id/verify/:token
// @access    Public  // VERIFIED
const verifyToken = async (req, res) => {
  try {
    // console.log(req.params.id);
    // console.log(req.params.token);
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({
        message: "User doesn't found",
        success: false,
      });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    // console.log(token);
    if (!token) {
      return res.status(400).send({
        message: "Token doesn't exist",
        success: false,
      });
    }

    await User.updateOne({ _id: user._id }, { $set: { verified: true } });
    await Token.deleteOne({ userId: user._id });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error Token not verified",
      success: false,
      error: error.message,
    });
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
        message: "User not found",
        success: false,
      });
    }
    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Wrong password",
        success: false,
      });
    }
    // Sending Email if User not verified
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }

      return res.status(400).send({
        message: "An Email sent to your account please verify",
        success: false,
      });
    }
    // generate cookie using JWT
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
    res.status(400).json({ errors, success: false });
  }
};

// @desc      Update user profile
// @route     PUT /users/profile
// @access    Private  // VERIFIED
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password, gender, country } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) {
      if (validator.isEmail(email) === false) {
        return res.status(400).json({
          errors: { email: "Invalid Email" },
          success: false,
        });
      }
      user.email = email;
    }
    if (password) {
      if (password.length >= 6) {
        user.password = await bcrypt.hash(password, 10);
      } else {
        return res.status(400).json({
          errors: { password: "Password must be at least 6 characters" },
          success: false,
        });
      }
    }
    if (gender) user.gender = gender;
    if (country) user.country = country;

    // Check if a new image file is provided in the request
    const newImageFile = req.files?.image;
    if (newImageFile) {
      // Call the deleteImage middleware with async/await
      await cloudinaryMiddleware.deleteImage(user.image);
      // Call the uploadImage middleware with async/await
      await cloudinaryMiddleware.uploadImage(req, res);
      // Check if the upload was successful
      const uploadResult = res.locals.uploadResult;
      // Save the Cloudinary image URL to the updated post
      user.image = uploadResult.imageUrl;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while updating user profile",
      success: false,
      error: err.message,
    });
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

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Use populate to get the posts, comments, and likes data
    const user = await User.findById(userId)
      .populate("posts") // Assuming 'posts' is the path to the Posts collection
      .populate("comments") // Assuming 'comments' is the path to the Comments collection
      .populate("likes"); // Assuming 'likes' is the path to the Likes collection

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // console.log(user.image);

    res.status(200).json({
      message: "User found successfully",
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message,
    });
  }
};

// @desc      Forgot password
// @route     POST /users/forgot-password
// @access    Public  // VERIFIED
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // Check if a reset token already exists for the user
    const existingToken = await Token.findOne({ userId: user._id });

    if (existingToken) {
      return res.status(409).json({
        message: "An Email is Already been sent to reset the password",
        success: false,
      });
    }
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}users/${user.id}/reset-password/${token.token}`;
    await mailSender(
      user.email,
      "You have requested to reset your password. Please click the button below to set a new password:",
      url,
      "Reset Password"
    );
    res.status(200).json({
      message: "Password reset link sent to your email",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error ocuured during sending mail to reset the password",
      success: false,
      error: err.message,
    });
  }
};

// @desc      Reset password
// @route     POST /users/:id/reset-password/:token
// @access    Public  // VERIFIED
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send({
        message: "Token doesn't exist",
        success: false,
      });
    }
    let hashedPassword = "";
    if (password.length >= 6) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    await Token.deleteOne({ userId: user._id });
    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Error occur during resetting the password",
      success: false,
      error: error.message,
    });
  }
};
export {
  signupHandler,
  signinHandler,
  updateProfile,
  logoutHandler,
  verifyToken,
  getProfile,
  forgotPassword,
  resetPassword,
};
