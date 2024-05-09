const express = require("express");
const {userAuth} = require("../middleware/authMiddleware.js");

const {
    commentPost,
    createPost,
    deletePost,
    getComments,
    getPost,
    getPosts,
    getUserPost,
    likePost,
    likePostComment,
    replyPostComment,
    updatePost, 
    deleteComment, 
    updateComment,
    sharePost,
    getSharedPosts
  } = require("../Controllers/postController.js") ;

const router = express.Router();


router.get("/",userAuth,getPosts);
router.post("/create-post", userAuth, createPost);
router.get("/:id",userAuth,getPost);
router.get("/get-user-post/:id", userAuth, getUserPost);
router.get("/comments/:postId", getComments);
router.post("/like/:id", userAuth, likePost);
router.post("/like-comment/:id/:rid?", userAuth, likePostComment);
router.post("/comment/:id", userAuth, commentPost);
router.post("/reply-comment/:id", userAuth, replyPostComment);
router.delete("/:id", userAuth, deletePost);
router.put("/:id", userAuth, updatePost); 
router.delete("/delete-comment/:id", userAuth, deleteComment);
router.put("/update-comment/:id", userAuth, updateComment); 
router.post("/share", sharePost);
router.get("/get-shared-posts/:userId", getSharedPosts);



module.exports = router;