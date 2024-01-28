const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
    questionType: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
