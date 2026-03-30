const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    players: {
      type: Number,
      required: true
    },
    durationHours: {
      type: Number,
      default: 1
    },
    timerRunning: {
      type: Boolean,
      default: false
    },
    timerStartedAt: {
      type: Date,
      default: null
    },
    timerRemainingSeconds: {
      type: Number,
      default: 3600
    },
    status: {
      type: String,
      enum: ["planned", "active", "finished"],
      default: "planned"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Game", gameSchema);
