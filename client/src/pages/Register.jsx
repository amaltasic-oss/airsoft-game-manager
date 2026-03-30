import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/users/register`, {
        username,
        email,
        password
      });

      setMessage("Registracija uspješna!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Greška kod registracije");
    }
  };

  return (
  <div className="container">

      <h2 className="page-title">Register</h2>

      <p className="game-meta" style={{ marginBottom: "18px" }}>
  Kreiraj račun i započni organizaciju svojih airsoft događaja.
</p>


      {message && <div className="message">{message}</div>}

      <form className="form-card" onSubmit={submitHandler}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Unesi username"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Unesi email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Unesi lozinku"
          />
        </div>

        <button className="btn" type="submit">
          Registriraj se
        </button>
      </form>
    </div>
  );
}

export default Register;