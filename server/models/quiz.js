const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    questionType:{
      type: String,
      default:"Quiz"
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
    timer: {
      type: Number,
      enum: [1000, 5, 10],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visitiedHistory:{
      type:Array,
      default:[]
    }
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
