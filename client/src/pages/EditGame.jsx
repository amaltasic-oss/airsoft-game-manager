import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../api";

function EditGame() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [players, setPlayers] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`${API_URL}/games/${id}`);
        setName(response.data.name);
        setLocation(response.data.location);
        setPlayers(response.data.players);
        setDurationHours(response.data.durationHours || 1);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Greška kod dohvaćanja igre"
        );
      }
    };

    fetchGame();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/games/${id}`,
        {
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

      setMessage("Igra je uspješno ažurirana");

      setTimeout(() => {
        navigate("/my-games");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod ažuriranja igre"
      );
    }
  };

  if (!userInfo) {
    return (
      <div className="container">
        <div className="message">Moraš biti prijavljen da uređuješ igru.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Edit Game</h2>

      <p className="game-meta" style={{ marginBottom: "18px" }}>
        Ažuriraj podatke postojeće airsoft igre i prilagodi trajanje, lokaciju ili broj igrača.
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
            Spremi promjene
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditGame;