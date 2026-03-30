const express = require("express");
const router = express.Router();
const {
  getPlayersByGame,
  createPlayer,
  updatePlayerStatus,
  deletePlayer,
  autoAssignTeams,
  resetPlayerStatuses
} = require("../controllers/playerController");
const { protect } = require("../middleware/authMiddleware");

router.get("/game/:gameId", getPlayersByGame);
router.post("/game/:gameId", protect, createPlayer);
router.put("/game/:gameId/auto-assign", protect, autoAssignTeams);
router.put("/game/:gameId/reset-statuses", protect, resetPlayerStatuses);
router.put("/:playerId/status", protect, updatePlayerStatus);
router.delete("/:playerId", protect, deletePlayer);
router.get("/test-reset", (req, res) => {
  res.json({ message: "player routes rade" });
});


module.exports = router;
