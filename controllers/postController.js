import Post from "../model/postModel.js";
import Like from "../model/likeModel.js";
import Comment from "../model/commentModel.js";
import User from "../model/userModel.js";
import cloudinaryMiddleware from "../middleware/cloudinaryMiddleware.js";

const createPost = async (req, res) => {
  try {
    const { title, description, createdAt } = req.body;
    const userId = req.user.id;
    // Call the uploadImage middleware with async/await
    await cloudinaryMiddleware.uploadImage(req, res);

    // Check if the upload was successful
    const uploadResult = res.locals.uploadResult;

    const imageUrl = uploadResult.imageUrl;
    const post = new Post({
      title,
      description,
      image: imageUrl,
      userId,
      createdAt,
    });
    const newPost = await post.save();

    // Update the user's posts array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.posts.push(newPost._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      newPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / pageSize);

    const posts = await Post.find()
      .populate("comments")
      .populate("likes")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("comments")
      .populate("likes")
      .exec();
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    // Check if the authenticated user is the creator of the post
    if (post.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }
    // Check if a new image file is provided in the request
    const newImageFile = req.files?.image;
    if (newImageFile) {
      // Call the deleteImage middleware with async/await
      await cloudinaryMiddleware.deleteImage(post.image);
      // Call the uploadImage middleware with async/await
      await cloudinaryMiddleware.uploadImage(req, res);
      // Check if the upload was successful
      const uploadResult = res.locals.uploadResult;
      // Save the Cloudinary image URL to the updated post
      req.body.image = uploadResult.imageUrl;
    }

    // Update the post with the new data
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the authenticated user is the creator of the post
    if (post.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }
    // Call the deleteImage middleware with async/await
    await cloudinaryMiddleware.deleteImage(post.image);

    await post.deleteOne();

    // Remove the post ID from the user's posts array
    const user = await User.findById(req.user.id);
    user.posts.pull(req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id })
      .populate("comments")
      .populate("likes")
      .exec();
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const like = new Like({
      postId: post._id,
      userId: req.user.id,
    });

    await like.save();

    // Update the post
    post.likes.push(like._id);
    await post.save();

    // Update the user's liked posts
    const user = await User.findById(req.user.id);
    user.likes.push(like._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Post liked successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const unlikePost = async (req, res) => {
  try {
    const like = await Like.findOne({
      postId: req.params.id,
      userId: req.user.id,
    });
    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }
    // delete like from like collection
    await like.deleteOne();

    // delete like from post collection
    const post = await Post.findById(req.params.id);
    post.likes.pull(like._id);
    await post.save();

    // Remove the like from the user's liked posts
    const user = await User.findById(req.user.id);
    user.likes.pull(like._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Post unliked successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    console.log(post);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const comment = new Comment({
      postId: post._id,
      userId: req.user.id,
      comment: req.body.comment,
    });
    // save comment to comment collection
    await comment.save();
    // push comment to post collection
    post.comments.push(comment._id);
    await post.save();
    // push comment to user collection
    const user = await User.findById(req.user.id);
    user.comments.push(comment._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Remove comment from post collection
    const post = await Post.findById(comment.postId);
    post.comments.pull(comment._id);
    await post.save();

    // Remove comment from user collection
    const user = await User.findById(req.user.id);
    user.comments.pull(comment._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("userId").exec();
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export {
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
};
