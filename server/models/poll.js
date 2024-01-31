const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    questionType:{
      type: String,
      default:"Poll"
    },
    title: {
      type: String,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
    optionType: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visitedHistory:{
      type:Array,
      default:[]
    }
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
