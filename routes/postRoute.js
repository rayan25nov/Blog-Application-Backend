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
  getAllLikes,
  commentPost,
  deleteComment,
  getAllCommentsForSpecificPost,
  getAllPostIdForSpecificUser,
} from "../controllers/postController.js";

// middlewares
import {
  requireAuth,
  requireAdmin,
  requireUser,
} from "../middleware/userMiddleware.js";
// import singleUpload from "../middleware/multer.js";
// import uploadImage from "../middleware/cloudinaryMiddleware.js";

// Post Related Routes
router.get("/", getAllPosts);
router.post("/create", requireAuth, createPost);
router.get("/:id", getPostById);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

// Post by user Id
router.get("/user/postId", requireAuth, getAllPostIdForSpecificUser);
router.get("/user/:id", getPostsByUserId);

// All the likes related Routes
router.put("/like/:id", requireAuth, likePost);
router.put("/unlike/:id", requireAuth, unlikePost);
router.get("/likes/:id", getAllLikes);

// All the comments related Routes
router.put("/comment/:postId", requireAuth, commentPost);
router.delete("/comment/:postId/:commentId", requireAuth, deleteComment);
router.get("/comment/:postId", getAllCommentsForSpecificPost);

export default router;
