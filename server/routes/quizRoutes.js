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
    const { title, questions, optionType, timer } = req.body;
    if (!title || !questions || !optionType || !timer) {
      res.status(401).json({ error: "one of the fields are missing" });
    }

    const newQuiz = new Quiz({ title, questions, optionType, timer, userId });
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
      const url = `${process.env.FRONTEND_URL}/takequiz/${newQuizId}`;
      return res.status(201).json({ url });
    }
    return res.status(500).json({ error: e.message });
  } catch (e) {
    res.json({ error: e.message });
  }
});

//get a particular quiz data
router.get("/getquizdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }

    if(req.query.taking){
      await Quiz.findByIdAndUpdate(id, {$push:{visitiedHistory:Date.now()}},{new:true});
    }
    const quiz = await Quiz.findOne({ _id: id });
    console.log(quiz);
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

    const { questions, optionType, timer } = req.body;
    if (!questions || !optionType || !timer) {
      res.status(401).json({ error: "one of the fields are missing" });
    }
    console.log(questions);

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        questions,
        optionType,
        timer,
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    const url = `${process.env.FRONTEND_URL}/takequiz/${id}`;
    return res
      .status(200)
      .json({ success: "Updated successfully!", url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//delete a particular quiz
router.delete("/deletequiz/:id", cookieAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }
    console.log(id);

    Quiz.findByIdAndDelete(id)
      .then(() => res.status(200).json({ status: "deleted!" }))
      .catch((e) => res.status(500).json({ error: e.message }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// handle quiz result
router.post("/quizresult/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }

    const { answers } = req.body;
    console.log(answers);
    const quiz = await Quiz.findOne({ _id: id });
    const quizQuestions = [...quiz.questions];
    let count = 0;
    quizQuestions.forEach((q, idx) => {
      if (q.correctOption === answers[idx]) {
        count += 1;
      }
    });

    const copiedQuiz = { ...quiz.toObject() };

    copiedQuiz.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined) {
        console.log("count:", q.options[answers[idx]].count);
        q.options[answers[idx]].count += 1;
      }
    });

    console.log("copiedQuiz", copiedQuiz);
    await Quiz.findByIdAndUpdate(id, copiedQuiz);
    res.status(200).json({ count });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//quiz analysis
router.get("/quizanalysis/:id", cookieAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "no id present" });
    }

    const quiz = await Quiz.findOne({ _id: id });
    if (!quiz) {
      return res.status(404).json({ error: "quiz not found" });
    }

    const copiedQuiz = { ...quiz.toObject() };

    copiedQuiz.questions.forEach((q) => {
      let totalCount = 0;
      let correctCount = 0;
      let wrongCount = 0;
      q.options.forEach((opt, idx) => {
        totalCount += opt.count;
        if (idx === q.correctOption) {
          correctCount += opt.count;
        } else {
          wrongCount += opt.count;
        }
      });
      q.totalCount = totalCount;
      q.correctCount = correctCount;
      q.wrongCount = wrongCount;
    });

    console.log("copiedQuiz", copiedQuiz);

    res.status(200).json({ questions: copiedQuiz.questions, title:copiedQuiz.title });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// router.post('/addquizimpression/:id',async(req,res)=>{
//   try {
//     const { id } = req.params;
//     if (!id) {
//       res.status(400).json({ error: "no id present" });
//     }    
    
//     await Quiz.findByIdAndUpdate(id, {$push:{visitiedHistory:Date.now()}},{new:true});
//     res.status(200).json({ count: true });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// })

module.exports = router;
