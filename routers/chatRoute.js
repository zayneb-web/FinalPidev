const  express =  require  ( 'express');
const chatController=  require(  '../Controllers/chatController.js');
const {userAuth} = require("../middleware/authMiddleware.js");

const router = express.Router()

router.post('/create', chatController.createChat);
router.get('/:userId' , chatController.userChats);
router.get('/find/:firstId/:secondId', chatController.findChat);
router.get('/search', chatController.getUsersForSidebar);
router.delete('/delete/:chatId', chatController.deleteChat);
router.post('/createGroup', chatController.createGroupChat);
router.post('/leaveGroup/:chatId', chatController.leaveGroupChat);
module.exports = router;