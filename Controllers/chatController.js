const  ChatModel  = require ("../Models/chatModel.js");
const User = require("../Models/user.js");

//create chat
exports.createChat = async (req, res) => {
    const newChat = new ChatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };


  exports.createGroupChat = async (req, res) => {
    try {
      const { members, groupename } = req.body;
  
      // Create a new group chat
      const newChat = new ChatModel({
        groupename: groupename,
        members: members,
        isGroupChat: true, // Set isGroupChat to true by default
      });
  
      // Save the new group chat
      const result = await newChat.save();
  
      res.status(200).json(result);
    } catch (error) {
      console.error('Error creating group chat:', error);
      res.status(500).json({ error: 'Error creating group chat' });
    }
  };  
  
// In your chatController.js or wherever your backend logic resides

// Leave group chat
exports.leaveGroupChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.User._id; // Assuming user ID is stored in req.user._id

  try {
    // Find the group chat by ID
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the current user is a member of the group
    const isMember = chat.members.includes(userId);
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    // Remove the user from the group members
    chat.members = chat.members.filter(memberId => memberId !== userId);

    // Save the updated chat
    await chat.save();

    res.json({ message: 'You have left the group successfully' });
  } catch (error) {
    console.error('Error leaving group chat:', error);
    res.status(500).json({ message: 'Failed to leave group chat' });
  }
};

  
  //get chat of a user
  exports.userChats = async (req, res) => {
    try {
      const chat = await ChatModel.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  //get chat of two users
  exports.findChat = async (req, res) => {
    try {
      const chat = await ChatModel.findOne({
        members: { $all: [req.params.firstId, req.params.secondId] },
      });
      res.status(200).json(chat)
    } catch (error) {
      res.status(500).json(error)
    }
  };


  exports.getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const searchQuery = req.query.query;

        // Construct a regex pattern to perform a case-insensitive search
        const regex = new RegExp(searchQuery, 'i');

        let filteredUsers;

        if (searchQuery) {
            filteredUsers = await User.find({
                _id: { $ne: loggedInUserId },
                $or: [
                    { firstName: { $regex: regex } },
                    { lastName: { $regex: regex } },
                    { email: { $regex: regex } }
                ]
            }).select("-password");
        } else {
            filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        }

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    const deletedChat = await ChatModel.findByIdAndDelete(chatId);
    if (!deletedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Failed to delete chat' });
  }
};