const express = require("express");
const router = express.Router();
const {
  getScoreByGame,
  updateScore,
  resetScore
} = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:gameId", getScoreByGame);
router.put("/:gameId", protect, updateScore);
router.put("/:gameId/reset", protect, resetScore);

module.exports = router;
