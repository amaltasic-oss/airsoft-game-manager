import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyGames from "./pages/MyGames";
import CreateGame from "./pages/CreateGame";
import EditGame from "./pages/EditGame";
import Scoreboard from "./pages/Scoreboard";
import Players from "./pages/Players";
import GameControl from "./pages/GameControl";
import Footer from "./components/Footer";



function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scoreboard/:gameId" element={<Scoreboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/players/:gameId" element={<Players />} />
          <Route path="/my-games" element={<ProtectedRoute><MyGames /></ProtectedRoute>} />
          <Route path="/create-game" element={<ProtectedRoute><CreateGame /></ProtectedRoute>} />
          <Route path="/edit-game/:id" element={<ProtectedRoute><EditGame /></ProtectedRoute>} />
          <Route path="/game-control/:gameId" element={<ProtectedRoute><GameControl /></ProtectedRoute>} />
        </Routes>
         <Footer />
      </div>
    </BrowserRouter>
  );
  
}


export default App;