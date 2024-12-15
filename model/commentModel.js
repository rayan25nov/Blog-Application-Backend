import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  userId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Comment", commentSchema);