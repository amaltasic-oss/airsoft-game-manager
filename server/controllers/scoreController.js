const Score = require("../models/Score");
const Game = require("../models/Game");

const getScoreByGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    let score = await Score.findOne({ game: gameId });

    if (!score) {
      const gameExists = await Game.findById(gameId);

      if (!gameExists) {
        return res.status(404).json({ message: "Igra nije pronađena" });
      }

      score = await Score.create({
        game: gameId,
        teamAName: "Team A",
        teamBName: "Team B",
        teamA: 0,
        teamB: 0,
        objectives: [
          { title: "Capture the flag", completed: false },
          { title: "Hold the base", completed: false },
          { title: "Escort the VIP", completed: false }
        ]
      });
    }

    res.json(score);
  } catch (error) {
    res.status(500).json({ message: "Greška kod dohvaćanja scoreboarda" });
  }
};

const updateScore = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { teamA, teamB, teamAName, teamBName, objectives } = req.body;

    let score = await Score.findOne({ game: gameId });

    if (!score) {
      const gameExists = await Game.findById(gameId);

      if (!gameExists) {
        return res.status(404).json({ message: "Igra nije pronađena" });
      }

      score = new Score({
        game: gameId,
        teamA: teamA ?? 0,
        teamB: teamB ?? 0,
        teamAName: teamAName || "Team A",
        teamBName: teamBName || "Team B",
        objectives: objectives || [
          { title: "Capture the flag", completed: false },
          { title: "Hold the base", completed: false },
          { title: "Escort the VIP", completed: false }
        ]
      });
    } else {
      score.teamA = teamA;
      score.teamB = teamB;
      score.teamAName = teamAName;
      score.teamBName = teamBName;
      score.objectives = objectives;
    }

    const savedScore = await score.save();

    res.json(savedScore);
  } catch (error) {
    res.status(500).json({ message: "Greška kod ažuriranja scoreboarda" });
  }
};

const resetScore = async (req, res) => {
  try {
    const { gameId } = req.params;

    const score = await Score.findOne({ game: gameId });

    if (!score) {
      return res.status(404).json({ message: "Scoreboard nije pronađen" });
    }

    score.teamA = 0;
    score.teamB = 0;

    const updatedScore = await score.save();

    res.json({
      message: "Scoreboard je resetiran",
      score: updatedScore
    });
  } catch (error) {
    res.status(500).json({ message: "Greška kod resetiranja scoreboarda" });
  }
};


module.exports = {
  getScoreByGame,
  updateScore,
  resetScore
};
