const express = require("express");
const router = express.Router();

const cookieAuth = require("../middlewares/cookieAuth");
const {
  handleCreateQuiz,
  handleGetQuizData,
  handleUpdateQuiz,
  handleDeleteQuiz,
  handleQuizResult,
  handleQuizAnalysis,
} = require("../controllers/quizController");

//create a new quiz
router.post("/createquiz", cookieAuth, handleCreateQuiz);

//get a particular quiz data
router.get("/getquizdata/:id", handleGetQuizData);

//post the updated quiz data
router.post("/postupdatedquizdata/:id", cookieAuth, handleUpdateQuiz);

//delete a particular quiz
router.delete("/deletequiz/:id", cookieAuth, handleDeleteQuiz);

// handle quiz result
router.post("/quizresult/:id", handleQuizResult);

//quiz analysis
router.get("/quizanalysis/:id", cookieAuth, handleQuizAnalysis);

module.exports = router;
