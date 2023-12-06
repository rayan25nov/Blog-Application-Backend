import express from "express";
const router = express.Router();
import {
  sendOtp,
  signinHandler,
  signupHandler,
  logoutHandler,
  verifyToken,
} from "../controllers/userController.js";

// middlewares
import {
  requireAuth,
  requireAdmin,
  requireUser,
} from "../middleware/userMiddleware.js";

router.post("/sendotp", sendOtp);
router.post("/signin", signinHandler);
router.post("/signup", signupHandler);
router.post("/logout", logoutHandler);
router.get("/:id/verify/:token/", verifyToken);

export default router;
