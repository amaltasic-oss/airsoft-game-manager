const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    team: {
      type: String,
      default: "Unassigned"
    },
    status: {
      type: String,
      enum: ["active", "hit", "respawn"],
      default: "active"
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Game"
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

module.exports = mongoose.model("Player", playerSchema);
