import express from "express";
const router = express.Router();

import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUserId,
  likePost,
  unlikePost,
  commentPost,
  deleteComment,
} from "../controllers/postController.js";

// middlewares
import {
  requireAuth,
  requireAdmin,
  requireUser,
} from "../middleware/userMiddleware.js";

router.get("/", requireAuth, getAllPosts);
router.post("/create", requireAuth, createPost);
router.get("/:id", getPostById);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

router.get("/user/:id", getPostsByUserId);
router.put("/like/:id", requireAuth, likePost);
router.put("/unlike/:id", requireAuth, unlikePost);

router.put("/comment/:id", requireAuth, commentPost);
router.delete("/comment/:id/:commentId", requireAuth, deleteComment);

export default router;
