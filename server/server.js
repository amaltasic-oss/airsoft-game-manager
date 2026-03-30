const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const gameRoutes = require("./routes/gameRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const scoreRoutes = require("./routes/scoreRoutes");
const playerRoutes = require("./routes/playerRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Airsoft Game Manager backend radi!");
});

app.use("/games", gameRoutes);
app.use("/users", userRoutes);
app.use("/scores", scoreRoutes);
app.use("/players", playerRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});