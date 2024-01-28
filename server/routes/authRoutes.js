const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookieAuth = require('../middlewares/cookieAuth');

router.post("/signup", async (req, res, next) => {
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
});

router.post("/login", async (req, res) => {
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
      const token = await jwt.sign({userId:user._id}, process.env.JWT_KEY, {
        expiresIn: "7d",
      });

      res.status(200).send({ token, user });
    } else {
      return res.status(401).json({ error: "incorrect credentials" });
    }
  } catch (e) {
    return res.json({ error: e.message });
  }
});


//! modify below
router.get('/userdata',cookieAuth,async(req,res)=>{
  try{
    const userId = req.user;
    const userInfo = await User.findOne({_id:userId}).populate('quizes');
    if(!userInfo){
      return res.status(404).json({error:'user not found'});
    }

    res.status(200).json({data:userInfo});

  }catch(e){
    res.status(500).json({error:e.message});
  }
})



module.exports = router;
