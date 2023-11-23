import express from "express";
const router = express.Router();
import {
  signinHandler,
  signupHandler,
  logoutHandler,
} from "../controllers/userController.js";

// Route for user registration (sign-up)
router.post("/signup", signupHandler);

// Route for user login (sign-in)
router.post("/signin", signinHandler);

//Route for user logout
router.get("/logout", logoutHandler);

export default router;
