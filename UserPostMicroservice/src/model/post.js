const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mediaIds: [{ type: String }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true },
);

//Create index for post using content field
postSchema.index({
  content: "text",
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
