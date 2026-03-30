import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyGames() {
  const [games, setGames] = useState([]);
  const [message, setMessage] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchMyGames = async () => {
    try {
      const response = await axios.get("http://localhost:5000/games/my-games", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      setGames(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod dohvaćanja tvojih igara"
      );
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchMyGames();

      const interval = setInterval(() => {
        fetchMyGames();
      }, 8000);

      return () => clearInterval(interval);
    }
  }, []);

  const deleteHandler = async (gameId) => {
    const confirmed = window.confirm("Jesi li siguran da želiš obrisati ovu igru?");

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/games/${gameId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      setMessage("Igra je uspješno obrisana");
      fetchMyGames();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod brisanja igre"
      );
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">My Games</h2>

      <p className="game-meta" style={{ marginBottom: "18px" }}>
        Ovdje vidiš igre koje si kreirao i možeš ih uređivati, brisati ili otvoriti njihove kontrole.
      </p>

      {message && <div className="message">{message}</div>}

      {!userInfo ? (
        <div className="card empty-state">
          Moraš biti prijavljen da vidiš svoje igre.
        </div>
      ) : games.length === 0 ? (
        <div className="card empty-state">
          Nemaš još nijednu igru.
        </div>
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
                <Link to={`/edit-game/${game._id}`}>
                  <button className="btn">Uredi</button>
                </Link>

                <Link to={`/scoreboard/${game._id}`}>
                  <button className="btn">Scoreboard</button>
                </Link>

                <Link to={`/players/${game._id}`}>
                  <button className="btn">Players</button>
                </Link>

                <Link to={`/game-control/${game._id}`}>
                  <button className="btn">Game Control</button>
                </Link>

                <button
                  className="btn btn-danger"
                  onClick={() => deleteHandler(game._id)}
                >
                  Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyGames;
