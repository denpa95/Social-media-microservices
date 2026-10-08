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

// Create text index with no "stop-word" filtering
searchPostSchema.index({ content: "text" }, { default_language: "none" });
searchPostSchema.index({ createdAt: -1 });

const Search = mongoose.model("Search", searchPostSchema);

module.exports = Search;
