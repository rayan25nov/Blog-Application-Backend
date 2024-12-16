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

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Blog post management
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve all blog posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all blog posts
 *       500:
 *         description: Server error
 */
router.get("/", getAllPosts);

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Blog Post
 *               description:
 *                 type: string
 *                 example: This is the content of the blog post.
 *               image:
 *                 type: image
 *                 example: img.jpeg
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2023-05-20T12:00:00Z
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/create", requireAuth, createPost);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retrieve a specific blog post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully
 *       404:
 *         description: Blog post not found
 */
router.get("/:id", getPostById);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a blog post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Title
 *               description:
 *                 type: string
 *                 example: Updated content of the blog post.
 *               image:
 *                 type: image
 *                 example: img.jpeg
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 */
router.put("/:id", requireAuth, updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 */
router.delete("/:id", requireAuth, deletePost);

/**
 * @swagger
 * /posts/user/postId:
 *   get:
 *     summary: Retrieve all blog post IDs for the authenticated user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all post IDs
 *       401:
 *         description: Unauthorized
 */
router.get("/user/postId", requireAuth, getAllPostIdForSpecificUser);

/**
 * @swagger
 * /posts/user/{id}:
 *   get:
 *     summary: Retrieve all blog posts by a specific user ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of all blog posts by the user
 *       404:
 *         description: User not found
 */
router.get("/user/:id", getPostsByUserId);

/**
 * @swagger
 * /posts/like/{id}:
 *   put:
 *     summary: Like a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post liked successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/like/:id", requireAuth, likePost);

/**
 * @swagger
 * /posts/unlike/{id}:
 *   put:
 *     summary: Unlike a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post unliked successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/unlike/:id", requireAuth, unlikePost);

/**
 * @swagger
 * /posts/likes/{id}:
 *   get:
 *     summary: Retrieve all likes for a blog post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: List of all likes for the post
 *       404:
 *         description: Blog post not found
 */
router.get("/likes/:id", getAllLikes);

/**
 * @swagger
 * /posts/comment/{postId}:
 *   put:
 *     summary: Add a comment to a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: This is a comment.
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/comment/:postId", requireAuth, commentPost);

/**
 * @swagger
 * /posts/comment/{postId}/{commentId}:
 *   delete:
 *     summary: Delete a comment from a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/comment/:postId/:commentId", requireAuth, deleteComment);

/**
 * @swagger
 * /posts/comment/{postId}:
 *   get:
 *     summary: Retrieve all comments for a specific blog post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: List of all comments for the blog post
 *       404:
 *         description: Blog post not found
 */
router.get("/comment/:postId", getAllCommentsForSpecificPost);

export default router;
