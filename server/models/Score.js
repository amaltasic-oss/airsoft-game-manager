const mongoose = require("mongoose");

const objectiveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const scoreSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Game",
      unique: true
    },
    teamAName: {
      type: String,
      default: "Team A"
    },
    teamBName: {
      type: String,
      default: "Team B"
    },
    teamA: {
      type: Number,
      default: 0
    },
    teamB: {
      type: Number,
      default: 0
    },
    objectives: {
      type: [objectiveSchema],
      default: [
        { title: "Capture the flag", completed: false },
        { title: "Hold the base", completed: false },
        { title: "Escort the VIP", completed: false }
      ]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Score", scoreSchema);
