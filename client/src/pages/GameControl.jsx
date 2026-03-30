import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import API_URL from "../api";

function GameControl() {
  const { gameId } = useParams();
  const [message, setMessage] = useState("");
  const [game, setGame] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchGame = async () => {
    try {
      const response = await axios.get(`${API_URL}/games/${gameId}`);
      setGame(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod dohvaćanja igre"
      );
    }
  };

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  const updateGameStatusHandler = async (newStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/games/${gameId}/status`,
        {
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setGame(response.data);
      setMessage(`Status igre je postavljen na "${response.data.status}"`);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod promjene statusa igre"
      );
    }
  };

  const resetScoreHandler = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/scores/${gameId}/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod resetiranja scoreboarda"
      );
    }
  };

  const resetStatusesHandler = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/players/game/${gameId}/reset-statuses`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod resetiranja statusa igrača"
      );
    }
  };

  if (!userInfo) {
    return (
      <div className="container">
        <div className="message">Moraš biti prijavljen za upravljanje igrom.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Game Control Panel</h2>

      {message && <div className="message">{message}</div>}

      <div className="panel-grid">
        <div className="card">
          <h3>Status igre</h3>
          <p className="game-meta">
            Trenutni status: {game?.status || "planned"}
          </p>

          <div className="action-row">
            <button
              className="btn"
              onClick={() => updateGameStatusHandler("planned")}
            >
              Set Planned
            </button>

            <button
              className="btn"
              onClick={() => updateGameStatusHandler("active")}
            >
              Start Game
            </button>

            <button
              className="btn btn-danger"
              onClick={() => updateGameStatusHandler("finished")}
            >
              Finish Game
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Kontrole igre</h3>

          <p className="game-meta">
            Ovdje organizator može resetirati scoreboard i vratiti statuse igrača.
          </p>

          <div className="action-row">
            <button className="btn" onClick={resetScoreHandler}>
              Reset Scoreboard
            </button>

            <button className="btn btn-danger" onClick={resetStatusesHandler}>
              Reset Player Statuses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameControl;
