const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    groupename: {
      type: String,
    },
    members: {
      type: Array,
    },
    isGroupChat: {
      type: Boolean,
      default: false, // Set default value to false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", ChatSchema);