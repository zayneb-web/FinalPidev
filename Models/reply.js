const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new mongoose.Schema(
  {
    reply: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply