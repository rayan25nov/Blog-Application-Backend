import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Like", likeSchema);
