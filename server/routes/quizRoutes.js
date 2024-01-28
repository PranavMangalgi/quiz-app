const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Quiz = require("../models/quiz");
const cookieAuth = require("../middlewares/cookieAuth");

//create a new quiz, send frontend with cookie
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

    console.log("newQuizId", newQuizId);

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

module.exports = router;
