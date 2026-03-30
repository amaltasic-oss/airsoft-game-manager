import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateGame() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [players, setPlayers] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userInfo || !userInfo.token) {
      setMessage("Moraš biti prijavljen da kreiraš igru");
      return;
    }

    try {
      await axios.post(`${API_URL}/games`, {
          name,
          location,
          players: Number(players),
          durationHours: Number(durationHours)
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      setMessage("Igra uspješno kreirana!");

      setTimeout(() => {
        navigate("/my-games");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod kreiranja igre"
      );
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">Create Game</h2>

      <p className="game-meta" style={{ marginBottom: "18px" }}>
        Kreiraj novu airsoft igru, postavi osnovne podatke i pripremi sve za organizaciju meča.
      </p>

      {message && <div className="message">{message}</div>}

      <form className="form-card" onSubmit={submitHandler}>
        <div className="form-group">
          <label>Naziv igre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Unesi naziv igre"
          />
        </div>

        <div className="form-group">
          <label>Lokacija</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Unesi lokaciju"
          />
        </div>

        <div className="form-group">
          <label>Broj igrača</label>
          <input
            type="number"
            value={players}
            onChange={(e) => setPlayers(e.target.value)}
            placeholder="Unesi broj igrača"
          />
        </div>

        <div className="form-group">
          <label>Trajanje igre (sati)</label>
          <input
            type="number"
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            placeholder="Unesi trajanje igre u satima"
          />
        </div>

        <div className="action-row">
          <button className="btn" type="submit">
            Kreiraj igru
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGame;