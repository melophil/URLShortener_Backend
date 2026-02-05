const express = require("express");
const cors = require("cors");
const urlRoutes = require("./routes/urlRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ✅ Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", urlRoutes);

module.exports = app;
