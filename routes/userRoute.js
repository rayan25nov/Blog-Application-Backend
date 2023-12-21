import express from "express";
const router = express.Router();
import {
  signinHandler,
  signupHandler,
  logoutHandler,
  verifyToken,
  getProfile,
} from "../controllers/userController.js";

// middleware
import {
  requireAuth,
  requireAdmin,
  requireUser,
} from "../middleware/userMiddleware.js";

// router.post("/sendotp", sendOtp);
router.post("/signin", signinHandler);
router.post("/signup", signupHandler);
router.post("/logout", logoutHandler);
router.get("/:id/verify/:token", verifyToken);
router.get("/profile", requireAuth, getProfile);

export default router;
