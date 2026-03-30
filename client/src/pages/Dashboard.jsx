import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_URL from "../api";

function Dashboard() {
  const [games, setGames] = useState([]);
  const [message, setMessage] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchGames = async () => {
try {
  const response = await axios.get(`${API_URL}/games`);
  setGames(response.data);
      } catch (error) {
        setMessage("Greška kod dohvaćanja igara");
      }
    };

    fetchGames();

    const interval = setInterval(fetchGames, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="hero-banner">
        <div className="hero-content">
          <p className="hero-badge">TACTICAL CONTROL SYSTEM</p>
          <h1 className="hero-title">Airsoft Game Manager</h1>
          <p className="hero-description">
            Upravljaj igrama, timovima, igračima, timerom i scoreboardom na jednom mjestu.
            Organizacija airsoft mečeva sada je brža, preglednija i profesionalnija.
          </p>
        </div>
      </div>

      <h3 className="section-title">Sve igre</h3>

      {message && <div className="message">{message}</div>}

      {games.length === 0 ? (
        <div className="card empty-state">Nema dostupnih igara.</div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <div key={game._id} className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{game.name}</h3>
                  <div className="card-subtitle">{game.location}</div>
                </div>

                <div
                  className={`game-status ${
                    game.status === "planned"
                      ? "status-planned"
                      : game.status === "active"
                      ? "status-active"
                      : "status-finished"
                  }`}
                >
                  {game.status || "planned"}
                </div>
              </div>

              <p className="game-meta">Broj igrača: {game.players}</p>
              <p className="game-meta">Trajanje: {game.durationHours || 1} h</p>

              <div className="action-row">
                <Link to={`/scoreboard/${game._id}`}>
                  <button className="btn">Scoreboard</button>
                </Link>

                <Link to={`/players/${game._id}`}>
                  <button className="btn">Players</button>
                </Link>

                <Link to={`/game-control/${game._id}`}>
                  <button className="btn">Game Control</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        {userInfo ? (
          <div className="message">
            Active Operator: <strong>{userInfo.username}</strong>
          </div>
        ) : (
          <div className="message">Nitko nije prijavljen.</div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;