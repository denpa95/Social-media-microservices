const mongoose = require("mongoose");
const { Schema } = mongoose;

const searchPostSchema = new Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

searchPostSchema.index({ content: "text" });
searchPostSchema.index({ createdAt: -1 });

const Search = mongoose.model("Search", searchPostSchema);

module.exports = Search;
