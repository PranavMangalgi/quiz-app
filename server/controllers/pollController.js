const User = require("../models/user");
const Poll = require("../models/poll");

const handleCreatePoll = async (req, res, next) => {
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
      const url = `${process.env.FRONTEND_URL}/takepoll/${newPollId}`;
      return res.status(201).json({ url });
    }
    return res.status(500).json({ error: e.message });
  } catch (e) {
    next(e);
  }
};

const handleGetPollData = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "no id present" });
    }
    console.log(id);
    if (req.query.taking) {
      await Poll.findByIdAndUpdate(
        id,
        { $push: { visitedHistory: Date.now() } },
        { new: true }
      );
    }
    const poll = await Poll.findOne({ _id: id });
    return res.status(200).json({ data: poll });
  } catch (e) {
    next(e);
  }
};

const handleUpdatePollData = async (req, res, next) => {
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
    const url = `${process.env.FRONTEND_URL}/takepoll/${id}`;
    return res.status(200).json({ success: "Updated successfully!", url });
  } catch (e) {
    next(e);
  }
};

const handleDeletePoll = async (req, res, next) => {
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
    next(e);
  }
};

const handlePollResult = async (req, res, next) => {
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
    next(e);
  }
};

module.exports = {
  handleCreatePoll,
  handleGetPollData,
  handleUpdatePollData,
  handleDeletePoll,
  handlePollResult,
};
