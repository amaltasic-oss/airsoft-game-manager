const express = require("express");
const router = express.Router();

const {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getMyGames,
  updateGameStatus,
  startGameTimer,
  pauseGameTimer,
  resetGameTimer
} = require("../controllers/gameController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getGames);
router.get("/my-games", protect, getMyGames);
router.get("/:id", getGameById);
router.post("/", protect, createGame);
router.put("/:id", protect, updateGame);
router.delete("/:id", protect, deleteGame);
router.put("/:id/status", protect, updateGameStatus);
router.put("/:id/timer/start", protect, startGameTimer);
router.put("/:id/timer/pause", protect, pauseGameTimer);
router.put("/:id/timer/reset", protect, resetGameTimer);



module.exports = router;