const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB je uspješno spojen");
  } catch (error) {
    console.error("Greška kod spajanja na MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;