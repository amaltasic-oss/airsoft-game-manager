import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password
      });

      localStorage.setItem("userInfo", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Greška kod prijave korisnika"
      );
    }
  };

 return (
  <div className="container">

      <h2 className="page-title">Login</h2>
      
      <p className="game-meta" style={{ marginBottom: "18px" }}>
  Prijavi se za upravljanje airsoft igrama i rezultatima.
</p>


      {message && <div className="message">{message}</div>}

      <form className="form-card" onSubmit={submitHandler}>
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
          Prijavi se
        </button>
      </form>
    </div>
  );
}

export default Login;