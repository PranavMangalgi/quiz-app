const express = require("express");
const router = express.Router();
const cookieAuth = require("../middlewares/cookieAuth");


const {
  handleCreatePoll,
  handleGetPollData,
  handleUpdatePollData,
  handleDeletePoll,
  handlePollResult,
} = require("../controllers/pollController");

//create a new poll
router.post("/createpoll", cookieAuth, handleCreatePoll);

//get a particular poll data
router.get("/getpolldata/:id", handleGetPollData);

//post the updated poll data
router.post("/postupdatedpolldata/:id", cookieAuth, handleUpdatePollData);

//delete a particular poll
router.delete("/deletepoll/:id", cookieAuth, handleDeletePoll);

// handle poll result
router.post("/pollresult/:id", handlePollResult);

module.exports = router;
