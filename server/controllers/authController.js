const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const handleSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "one or more fields are missing" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409).json({ error: "user already exists" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: encryptedPassword,
    });
    res.status(201).send("user created");
  } catch (e) {
    next(e);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "one or more fields are missing" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "user does not exist" });
    }

    const decryptedPassword = await bcrypt.compare(password, user.password);
    if (decryptedPassword) {
      const token = await jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
      });

      res.status(200).send({ token, user });
    } else {
      return res.status(401).json({ error: "incorrect credentials" });
    }
  } catch (e) {
    next(e);
  }
};

const handleUserData = async (req, res, next) => {
  try {
    const userId = req.user;
    const userInfo = await User.findOne({ _id: userId })
      .populate("quizes")
      .populate("polls");
    if (!userInfo) {
      return res.status(404).json({ error: "user not found" });
    }

    let quizes = userInfo.quizes.slice();
    const polls = userInfo.polls.slice();

    quizes = quizes.sort(
      (a, b) => b.visitedHistory.length - a.visitedHistory.length
    );

    let impressions = 0;
    let questionCount = 0;
    [...quizes, ...polls].forEach((q) => {
      impressions += q.visitedHistory.length;
      questionCount += q.questions.length;
    });

    console.log(impressions);

    res.status(200).json({
      quizes,
      impressions,
      quizesNumber: quizes.length,
      questionCount,
    });
  } catch (e) {
    next(e);
  }
};

const handleAnalytics = async (req, res, next) => {
  try {
    const userId = req.user;
    if (!userId) {
      res.status(401).json({ error: "user Id not present" });
    }
    const userInfo = await User.findOne({ _id: userId })
      .populate("quizes")
      .populate("polls");
    if (!userInfo) {
      return res.status(404).json({ error: "user not found" });
    }

    console.log(userInfo);

    const tableData = [...userInfo.polls, ...userInfo.quizes].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    res.status(200).json({ tableData });
  } catch (e) {
    next(e);
  }
};

module.exports = { handleSignUp, handleLogin, handleUserData, handleAnalytics };
