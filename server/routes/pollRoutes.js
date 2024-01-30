const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Poll = require("../models/poll");
const cookieAuth = require("../middlewares/cookieAuth");

//create a new poll
router.post("/createpoll", cookieAuth, async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      res.status(401).json({ error: "token not present" });
    }
    const { title, questions, optionType } = req.body;
    if (!title || !questions || !optionType) {
      res.status(401).json({ error: "one of the fields are missing" });
    }

    const newPoll = new Poll({ title, questions, optionType, userId });
    const newPollId = await newPoll
      .save()
      .then((newPoll) => newPoll._id)
      .catch((e) => {
        console.error(e);
      });

    if (newPollId) {
      await User.findByIdAndUpdate(
        userId,
        { $push: { polls: newPollId } },
        { new: true }
      );
      return res.status(201).json({ success });
    }
    return res.status(500).json({ error: e.message });
  } catch (e) {
    res.json({ error: e.message });
  }
});

//get a particular poll data
router.get("/getpolldata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }
    console.log(id);
    if(req.query.taking){
      await Poll.findByIdAndUpdate(id, {$push:{visitiedHistory:Date.now()}},{new:true});
    }
    const poll = await Poll.findOne({ _id: id });
    return res.status(200).json({ data: poll });
  } catch (e) {
    res.json({ error: e.message });
  }
});

//post the updated poll data
router.post("/postupdatedpolldata/:id", cookieAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }

    const { questions, optionType } = req.body;
    if (!questions || !optionType) {
      res.status(401).json({ error: "one of the fields are missing" });
    }
    console.log(questions);

    const updatedPoll = await Poll.findByIdAndUpdate(
      id,
      {
        questions,
        optionType,
      },
      { new: true }
    );

    if (!updatedPoll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    return res
      .status(200)
      .json({ success: "Updated successfully!", poll: updatedPoll });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//delete a particular poll
router.delete("/deletepoll/:id", cookieAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }
    console.log(id);

    Poll.findByIdAndDelete(id)
      .then(() => res.status(200).json({ status: "deleted!" }))
      .catch((e) => res.status(500).json({ error: e.message }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// handle poll result
router.post("/pollresult/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }

    const { answers } = req.body;
    console.log(answers);
    const poll = await Poll.findOne({ _id: id });
    const copiedPoll = { ...poll.toObject() };

    copiedPoll.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined) {
        console.log("count:", q.options[answers[idx]].count);
        q.options[answers[idx]].count += 1;
      }
    });

    console.log("copiedPoll", copiedPoll);
    await Poll.findByIdAndUpdate(id, copiedPoll);
    res.status(200).json({ count: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



module.exports = router;
