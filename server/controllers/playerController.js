const Player = require("../models/Player");
const Game = require("../models/Game");

const getPlayersByGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const players = await Player.find({ game: gameId });

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Greška kod dohvaćanja igrača" });
  }
};

const createPlayer = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { name, team } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Ime igrača je obavezno" });
    }

    const gameExists = await Game.findById(gameId);

    if (!gameExists) {
      return res.status(404).json({ message: "Igra nije pronađena" });
    }

    const player = new Player({
      name,
      team: team || "Unassigned",
      status: "active",
      game: gameId,
      user: req.user._id
    });

    const savedPlayer = await player.save();

    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(500).json({ message: "Greška kod dodavanja igrača" });
  }
};

const updatePlayerStatus = async (req, res) => {
  try {
    const { playerId } = req.params;
    const { status } = req.body;

    const validStatuses = ["active", "hit", "respawn"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Neispravan status igrača" });
    }

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Igrač nije pronađen" });
    }

    player.status = status;

    const updatedPlayer = await player.save();

    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ message: "Greška kod ažuriranja statusa igrača" });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Igrač nije pronađen" });
    }

    await player.deleteOne();

    res.json({ message: "Igrač je obrisan" });
  } catch (error) {
    res.status(500).json({ message: "Greška kod brisanja igrača" });
  }
};

const autoAssignTeams = async (req, res) => {
  try {
    const { gameId } = req.params;

    const players = await Player.find({ game: gameId });

    if (players.length === 0) {
      return res.status(400).json({ message: "Nema igrača za raspoređivanje" });
    }

    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffledPlayers.length; i++) {
      shuffledPlayers[i].team = i % 2 === 0 ? "Team A" : "Team B";
      await shuffledPlayers[i].save();
    }

    res.json({ message: "Igrači su uspješno raspoređeni u timove" });
  } catch (error) {
    res.status(500).json({ message: "Greška kod raspoređivanja timova" });
  }
};

const resetPlayerStatuses = async (req, res) => {
  try {
    const { gameId } = req.params;

    await Player.updateMany(
      { game: gameId },
      { $set: { status: "active" } }
    );

    res.json({ message: "Svi statusi igrača su resetirani na active" });
  } catch (error) {
     console.log("RESET PLAYER STATUSES ERROR:", error);
    res.status(500).json({ message: "Greška kod resetiranja statusa igrača" });
  }
};



module.exports = {
  getPlayersByGame,
  createPlayer,
  updatePlayerStatus,
  deletePlayer,
  autoAssignTeams,
  resetPlayerStatuses

};
