const express = require("express");
const {getTags, askQuestion, answerQuestion, getQuestions, UpVote, DownVote, GetQuestionByID, findTopic, getAllUsers } = require("../Controllers/forumController");
const router = express.Router();

router.post("/ask-question",askQuestion)
router.post("/answer/:id",answerQuestion)
router.get("/questions",getQuestions)
router.post("/upvote/:id",UpVote)
router.post("/downvote/:id",DownVote)
router.get("/my-questions/:id",GetQuestionByID)
router.get("/find/:topic",findTopic)
router.get("/allusers",getAllUsers)
router.get('/tags', getTags);

module.exports = router;