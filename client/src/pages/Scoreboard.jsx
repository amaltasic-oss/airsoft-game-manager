import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Scoreboard() {
  const { gameId } = useParams();

  const [score, setScore] = useState(null);
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState("");
  const [displayTime, setDisplayTime] = useState(0);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchScore = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/scores/${gameId}`);
      setScore(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod dohvaćanja scoreboarda"
      );
    }
  };

  const fetchGame = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/games/${gameId}`);
      setGame(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod dohvaćanja igre"
      );
    }
  };

 useEffect(() => {
  fetchScore();
  fetchGame();

  const interval = setInterval(() => {
    fetchScore();
    fetchGame();
  }, 5000);

  return () => clearInterval(interval);
}, [gameId]);


  useEffect(() => {
    if (!game) return;

    const calculateRemainingTime = () => {
      if (game.timerRunning && game.timerStartedAt) {
        const now = new Date();
        const startedAt = new Date(game.timerStartedAt);
        const elapsedSeconds = Math.floor((now - startedAt) / 1000);

        return Math.max(0, game.timerRemainingSeconds - elapsedSeconds);
      }

      return game.timerRemainingSeconds || 0;
    };

    setDisplayTime(calculateRemainingTime());

    const interval = setInterval(() => {
      setDisplayTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [game]);

  const saveScore = async (updatedScore) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/scores/${gameId}`,
        updatedScore,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setScore(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod ažuriranja scoreboarda"
      );
    }
  };

  const updateScorePoints = (newTeamA, newTeamB) => {
    saveScore({
      ...score,
      teamA: newTeamA,
      teamB: newTeamB
    });
  };

  const updateTeamName = (field, value) => {
    setScore((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const saveTeamNames = () => {
    saveScore(score);
  };

  const toggleObjective = (index) => {
    const updatedObjectives = [...score.objectives];
    updatedObjectives[index].completed = !updatedObjectives[index].completed;

    saveScore({
      ...score,
      objectives: updatedObjectives
    });
  };

  const startTimer = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/games/${gameId}/timer/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setGame(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod pokretanja timera"
      );
    }
  };

  const pauseTimer = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/games/${gameId}/timer/pause`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setGame(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod pauziranja timera"
      );
    }
  };

  const resetTimer = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/games/${gameId}/timer/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setGame(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod resetiranja timera"
      );
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  if (!score || !game) {
    return (
      <div className="container">
        <h2 className="page-title">Scoreboard</h2>
        {message && <div className="message">{message}</div>}
        <div className="card">Učitavanje scoreboarda...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Scoreboard</h2>
<p className="game-meta" style={{ marginBottom: "18px" }}>
  Prati rezultat, timer i ciljeve igre u stvarnom vremenu.
</p>

      {message && <div className="message">{message}</div>}

      <div className="card">
        <h3>{game.name}</h3>
        <p className="game-meta">Lokacija: {game.location}</p>
        <p className="game-meta">Trajanje: {game.durationHours || 1} h</p>
        <p className="game-meta">Status: {game.status || "planned"}</p>
      </div>

      <div className="card">
  <h3>Timer</h3>

  <div className="timer-wrapper">
    <div className="timer-label">MISSION TIMER</div>
    <div className="timer-box">{formatTime(displayTime)}</div>
  </div>

  {userInfo && (
    <div className="action-row">
      <button className="btn" onClick={startTimer}>
        Start
      </button>

      <button className="btn" onClick={pauseTimer}>
        Pause
      </button>

      <button className="btn" onClick={resetTimer}>
        Reset
      </button>
    </div>
  )}
</div>


      <div className="card">
        <h3>Nazivi timova</h3>

        <div className="form-group">
          <label>Team A Name</label>
          <input
            type="text"
            value={score.teamAName}
            onChange={(e) => updateTeamName("teamAName", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Team B Name</label>
          <input
            type="text"
            value={score.teamBName}
            onChange={(e) => updateTeamName("teamBName", e.target.value)}
          />
        </div>

        {userInfo && (
          <button className="btn" onClick={saveTeamNames}>
            Spremi nazive timova
          </button>
        )}
      </div>

      <div className="card">
        <h3>Rezultat igre</h3>

        <div className="scoreboard-grid">
          <div className="score-box">
            <div className="score-team-name">{score.teamAName}</div>
            <div className="score-number">{score.teamA}</div>
            {userInfo && (
              <button
                className="btn"
                onClick={() => updateScorePoints(score.teamA + 1, score.teamB)}
              >
                +1 {score.teamAName}
              </button>
            )}
          </div>

          <div className="score-box">
            <div className="score-team-name">{score.teamBName}</div>
            <div className="score-number">{score.teamB}</div>
            {userInfo && (
              <button
                className="btn"
                onClick={() => updateScorePoints(score.teamA, score.teamB + 1)}
              >
                +1 {score.teamBName}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Mission Objectives</h3>

        {score.objectives.map((objective, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px"
            }}
          >
            <span>
              {objective.completed ? "✅" : "❌"} {objective.title}
            </span>

            {userInfo && (
              <button className="btn" onClick={() => toggleObjective(index)}>
                Promijeni status
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scoreboard;
