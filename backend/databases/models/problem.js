const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProblemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
  difficulty: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  createUserId: {
    type: String,
    required: true,
  },
  createDateTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastUpdateUserId: {
    type: String,
  },
  lastUpdateDateTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Problem", ProblemSchema);
