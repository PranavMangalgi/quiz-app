const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  quizes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  }],
  polls: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
  }]
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
