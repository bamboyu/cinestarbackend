const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log(err));

// Use Routes
app.use("/api/auth", require("./routes/auth")); // Customers
app.use("/api/theaters", require("./routes/theaters")); // Theaters
app.use("/api/showtimes", require("./routes/showtimes")); // Showtimes
app.use("/api/rooms", require("./routes/screeningRooms"));
app.use("/api/movies", require("./routes/movies"));
app.use("/api/categories", require("./routes/movieCategories"));

// ... app.listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
