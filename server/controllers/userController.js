const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Molimo unesi username, email i password"
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Korisnik s tim emailom već postoji"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await user.save();

    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      message: "Korisnik je uspješno registriran"
    });
  } catch (error) {
   console.log(error);
res.status(500).json({
  message: error.message
});
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Molimo unesi email i password"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Neispravan email ili lozinka"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Neispravan email ili lozinka"
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message: "Prijava uspješna"
    });
  } catch (error) {
    res.status(500).json({
      message: "Greška kod prijave korisnika"
    });
  }
};
 
const getUserProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};