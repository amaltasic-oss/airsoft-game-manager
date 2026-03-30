import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import API_URL from "../api";

function Players() {
  const { gameId } = useParams();

  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [message, setMessage] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/players/game/${gameId}`);
      setPlayers(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod dohvaćanja igrača"
      );
    }
  };

  useEffect(() => {
    fetchPlayers();

    const interval = setInterval(() => {
      fetchPlayers();
    }, 5000);

    return () => clearInterval(interval);
  }, [gameId]);

  const addPlayerHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/players/game/${gameId}`,
        {
          name,
          team
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setName("");
      setTeam("");
      setMessage("Igrač uspješno dodan");
      fetchPlayers();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod dodavanja igrača"
      );
    }
  };

  const updateStatusHandler = async (playerId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/players/${playerId}/status`,
        {
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      fetchPlayers();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod promjene statusa igrača"
      );
    }
  };

  const deletePlayerHandler = async (playerId) => {
    const confirmed = window.confirm("Jesi li siguran da želiš obrisati igrača?");

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/players/${playerId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      setMessage("Igrač je uspješno obrisan");
      fetchPlayers();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod brisanja igrača"
      );
    }
  };

  const autoAssignTeamsHandler = async () => {
    try {
      await axios.put(
        `${API_URL}/players/game/${gameId}/auto-assign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setMessage("Igrači su automatski raspoređeni u timove");
      fetchPlayers();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod raspoređivanja timova"
      );
    }
  };

  const groupedPlayers = {
    "Team A": players.filter((player) => player.team === "Team A"),
    "Team B": players.filter((player) => player.team === "Team B"),
    Unassigned: players.filter(
      (player) =>
        player.team === "Unassigned" || !player.team || player.team.trim() === ""
    )
  };

  const renderPlayerCard = (player) => (
    <div key={player._id} className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{player.name}</h3>
          <div className="small-muted">Tim: {player.team}</div>
        </div>

        <div
          className={`status-badge ${
            player.status === "active"
              ? "status-active"
              : player.status === "hit"
              ? "status-hit"
              : "status-respawn"
          }`}
        >
          {player.status}
        </div>
      </div>

      {userInfo && (
        <div className="action-row">
          <button
            className="btn"
            onClick={() => updateStatusHandler(player._id, "active")}
          >
            Active
          </button>

          <button
            className="btn"
            onClick={() => updateStatusHandler(player._id, "hit")}
          >
            Hit
          </button>

          <button
            className="btn"
            onClick={() => updateStatusHandler(player._id, "respawn")}
          >
            Respawn
          </button>

          <button
            className="btn btn-danger"
            onClick={() => deletePlayerHandler(player._id)}
          >
            Obriši
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container">
      <h2 className="page-title">Players</h2>

      {message && <div className="message">{message}</div>}

      {userInfo && (
        <>
          <form className="form-card" onSubmit={addPlayerHandler}>
            <div className="form-group">
              <label>Ime igrača</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Unesi ime igrača"
              />
            </div>

            <div className="form-group">
              <label>Tim</label>
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Unesi tim"
              />
            </div>

            <button className="btn" type="submit">
              Dodaj igrača
            </button>
          </form>

          <div className="form-actions">
            <button className="btn" onClick={autoAssignTeamsHandler}>
              Automatski formiraj timove
            </button>
          </div>
        </>
      )}

      <h3 className="section-title">Lista igrača</h3>

      {players.length === 0 ? (
        <div className="card empty-state">Nema dodanih igrača.</div>
      ) : (
        <>
          {Object.entries(groupedPlayers).map(([teamName, teamPlayers]) => (
            <div key={teamName} className="team-section">
              <div className="team-section-header">
                <h3 className="section-title">{teamName}</h3>
                <div className="team-count">{teamPlayers.length} igrača</div>
              </div>

              {teamPlayers.length === 0 ? (
                <div className="card empty-state">Nema igrača u ovoj grupi.</div>
              ) : (
                <div className="player-grid">
                  {teamPlayers.map(renderPlayerCard)}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Players;
