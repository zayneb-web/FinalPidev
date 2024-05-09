const  MessageModel  = require ("../Models/messageModel.js");

  const fs = require("fs");

  exports.addMessage = async (req, res) => {
    const { chatId, senderId, type, text ,  video, file ,attachment } = req.body;
    let { audio } = req.body;

    // Handle audio file upload
    if (type === "audio" && audio) {
      const base64Data = audio.replace(/^data:audio\/mp3;base64,/, "");
      const audioPath = `uploads/audio/${Date.now()}-${senderId}.mp3`;

      // Save base64 audio data to file
      fs.writeFileSync(audioPath, base64Data, "base64");

      // Set audio field to file path
      audio = audioPath;
    }

    const message = new MessageModel({
      chatId,
      senderId,
      type,
      text,
      audio,
      video, 
      file,
      attachment,
    });

    try {
      const result = await message.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };


    //get messages of a chat by the chat id
    exports.getMessages = async (req, res) => {
      const { chatId } = req.params;
      try {
        const result = await MessageModel.find({ chatId });
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
    };


    exports.removeMessage = async (req, res) => {
      const { messageId } = req.params;
      try {
        const result = await MessageModel.findByIdAndDelete(messageId);
        if (result) {
          res.status(200).json({ message: "Message deleted successfully." });
        } else {
          res.status(404).json({ message: "Message not found." });
        }
      } catch (error) {
        res.status(500).json(error);
      }
    };