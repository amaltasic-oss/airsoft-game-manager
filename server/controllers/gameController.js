const Game = require("../models/Game");

const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "Greška kod dohvaćanja igara" });
  }
};

const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: "Igra nije pronađena" });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: "Greška kod dohvaćanja igre" });
  }
};

const createGame = async (req, res) => {
  try {
    const { name, location, players, durationHours } = req.body;

  if (!name || !location || !players || !durationHours) {
  return res.status(400).json({
    message: "Molimo unesi name, location, players i duration"
  });
}

    const game = new Game({
  name,
  location,
  players,
  durationHours,
  timerRunning: false,
  timerStartedAt: null,
  timerRemainingSeconds: Number(durationHours) * 3600,
  status: "planned",
  user: req.user._id
});


    const savedGame = await game.save();

    res.status(201).json(savedGame);
  } catch (error) {
    res.status(500).json({ message: "Greška kod spremanja igre" });
  }
};
const updateGame = async (req, res) => {
  try {
    const { name, location, players, durationHours } = req.body;

   if (!name || !location || !players || !durationHours) {
  return res.status(400).json({
    message: "Molimo unesi name, location, players i duration"
  });
}

    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: "Igra nije pronađena" });
    }

    if (game.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Nemaš dozvolu za uređivanje ove igre"
      });
    }

    game.name = name;
    game.location = location;
    game.players = players;
    game.durationHours = durationHours;
    
    const updatedGame = await game.save();

    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: "Greška kod ažuriranja igre" });
  }
};

const deleteGame = async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);

    if (!deletedGame) {
      return res.status(404).json({ message: "Igra nije pronađena" });
    }

    res.json({ message: "Igra je obrisana" });
  } catch (error) {
    res.status(500).json({ message: "Greška kod brisanja igre" });
  }
};
const getMyGames = async (req, res) => {
  try {
    const games = await Game.find({ user: req.user._id });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: "Greška kod dohvaćanja tvojih igara" });
  }
};
const updateGameStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["planned", "active", "finished"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Neispravan status igre" });
    }

    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ message: "Igra nije pronađena" });
    }

    if (!game.user) {
      return res.status(400).json({ message: "Igra nema vlasnika" });
    }

    if (game.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Nemaš dozvolu za promjenu statusa ove igre"
      });
    }

    game.status = status;

    const updatedGame = await game.save();

    res.json(updatedGame);
  } catch (error) {
    console.log("UPDATE GAME STATUS ERROR:", error);
    res.status(500).json({ message: "Greška kod promjene statusa igre" });
  }
};
const startGameTimer = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: "Igra nije pronađena" });
    }

    if (game.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Nemaš dozvolu za upravljanje timerom ove igre"
      });
    }

    if (!game.timerRunning) {
      game.timerRunning = true;
      game.timerStartedAt = new Date();
      await game.save();
    }

    res.json(game);
  } catch (error) {
    console.log("START TIMER ERROR:", error);
    res.status(500).json({ message: "Greška kod pokretanja timera" });
  }
};

const pauseGameTimer = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: "Igra nije pronađena" });
    }

    if (game.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Nemaš dozvolu za upravljanje timerom ove igre"
      });
    }

    if (game.timerRunning && game.timerStartedAt) {
      const now = new Date();
      const elapsedSeconds = Math.floor((now - game.timerStartedAt) / 1000);

      game.timerRemainingSeconds = Math.max(
        0,
        game.timerRemainingSeconds - elapsedSeconds
      );
      game.timerRunning = false;
      game.timerStartedAt = null;

      await game.save();
    }

    res.json(game);
  } catch (error) {
    console.log("PAUSE TIMER ERROR:", error);
    res.status(500).json({ message: "Greška kod pauziranja timera" });
  }
};

const resetGameTimer = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: "Igra nije pronađena" });
    }

    if (game.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Nemaš dozvolu za upravljanje timerom ove igre"
      });
    }

    game.timerRunning = false;
    game.timerStartedAt = null;
    game.timerRemainingSeconds = Number(game.durationHours || 1) * 3600;

    await game.save();

    res.json(game);
  } catch (error) {
    console.log("RESET TIMER ERROR:", error);
    res.status(500).json({ message: "Greška kod resetiranja timera" });
  }
};




module.exports = {
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
};
