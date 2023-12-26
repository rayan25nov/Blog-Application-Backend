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
  getAllComments,
} from "../controllers/postController.js";

// middlewares
import {
  requireAuth,
  requireAdmin,
  requireUser,
} from "../middleware/userMiddleware.js";
// import singleUpload from "../middleware/multer.js";
import uploadImage from "../middleware/cloudinaryMiddleware.js";

router.get("/", requireAuth, getAllPosts);
router.post("/create", requireAuth, createPost);
router.get("/:id", getPostById);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

router.get("/user/:id", getPostsByUserId);
router.put("/like/:id", requireAuth, likePost);
router.put("/unlike/:id", requireAuth, unlikePost);

router.put("/comment/:postId", requireAuth, commentPost);
router.delete("/comment/:postId/:commentId", requireAuth, deleteComment);
router.get("/comment/:postId", requireAuth, getAllComments);

export default router;
