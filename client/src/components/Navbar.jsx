import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar modern-navbar">
      <div className="navbar-inner modern-navbar-inner">
        <div className="navbar-left modern-navbar-left">
          <Link to="/" className="brand modern-brand">
            <img src={logo} alt="SOTII logo" className="brand-logo" />
          </Link>

          <div className="nav-links">
            <Link
              to="/"
              className={`nav-pill ${isActive("/") ? "nav-pill-active" : ""}`}
            >
              Command center
            </Link>

            {userInfo && (
              <Link
                to="/my-games"
                className={`nav-pill ${
                  isActive("/my-games") ? "nav-pill-active" : ""
                }`}
              >
                My Games
              </Link>
            )}

            {userInfo && (
              <Link
                to="/create-game"
                className={`nav-pill ${
                  isActive("/create-game") ? "nav-pill-active" : ""
                }`}
              >
                Create Game
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-right modern-navbar-right">
          {userInfo ? (
            <>
              <div className="user-chip">👤 {userInfo.username}</div>
              <button className="btn" onClick={logoutHandler}>
                Logout
              </button>
            </>
          ) : (
            <div className="nav-links">
              <Link
                to="/login"
                className={`nav-pill ${
                  isActive("/login") ? "nav-pill-active" : ""
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className={`nav-pill ${
                  isActive("/register") ? "nav-pill-active" : ""
                }`}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;