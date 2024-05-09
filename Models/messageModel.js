const mongoose = require("mongoose");

  const MessageSchema = new mongoose.Schema(
    {
      chatId: {
        type: String,
        
      },
      senderId: {
        type: String,
      },
      type: {
        type: String,
        enum: ["text", "video", "file", "audio", "attachment"], // Corrected typo here
      },
      text: {
        type: String,
      },
      video: {
        type: String,
      },
      file: {
        type: String,
      },
      audio: {
        type: String,
      },
      attachment: {
        type: String,
      },
  
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Message", MessageSchema);