const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Quiz = require("../models/quiz");
const cookieAuth = require("../middlewares/cookieAuth");

//create a new quiz
router.post("/createquiz", cookieAuth, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      res.status(401).json({ error: "token not present" });
    }
    const { title, questions, questionType, timer } = req.body;
    if (!title || !questions || !questionType || !timer) {
      res.status(401).json({ error: "one of the fields are missing" });
    }

    const newQuiz = new Quiz({ title, questions, questionType, timer, userId });
    const newQuizId = await newQuiz
      .save()
      .then((newQuiz) => newQuiz._id)
      .catch((e) => {
        console.error(e);
      });

    if (newQuizId) {
      await User.findByIdAndUpdate(
        userId,
        { $push: { quizes: newQuizId } },
        { new: true }
      );
      return res.status(201).json({ success });
    }
    return res.status(500).json({ error: e.message });
  } catch (e) {
    res.json({ error: e.message });
  }
});

//get a particular quiz data
router.get("/getquizdata/:id", cookieAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }
    const quiz = await Quiz.findOne({ _id: id });
    return res.status(200).json({ data: quiz });
  } catch (e) {
    res.json({ error: e.message });
  }
});

//post the updated quiz data
router.post("/postupdatedquizdata/:id", cookieAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }

    const { questions, questionType, timer } = req.body;
    if (!questions || !questionType || !timer) {
      res.status(401).json({ error: "one of the fields are missing" });
    }
    console.log(questions);

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        questions,
        questionType,
        timer,
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    return res
      .status(200)
      .json({ success: "Updated successfully!", quiz: updatedQuiz });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//delete a particular quiz
router.delete("/deletequiz", cookieAuth, async (req, res) => {
  try {
  } catch (e) {}
});

module.exports = router;
