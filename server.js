const express = require("express");
const cors = require("cors");
const path = require("path");
const socket = require("socket.io");
const app = express();
const mongoose = require("mongoose");
const helmet = require('helmet');

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === "production")
  dbURI = `mongodb+srv://m9KEMMlW5XB:${process.env.DB_PASS}@cluster0.cpy2a7a.mongodb.net/NewWaveDB?retryWrites=true&w=majority`;
else if (NODE_ENV === "test") dbURI = "mongodb://localhost:27017/NewWaveDBtest";
else dbURI = "mongodb://localhost:27017/NewWaveDB";

/* Server code for Replit */

// if (NODE_ENV === "test") dbURI = "mongodb://localhost:27017/NewWaveDBtest";
// else if (NODE_ENV === "development") dbURI = "mongodb://localhost:27017/NewWaveDB";
// else dbURI = `mongodb+srv://m9KEMMlW5XB:${process.env.DB_PASS}@cluster0.cpy2a7a.mongodb.net/NewWaveDB?retryWrites=true&w=majority`

//import routes
const testimonialRoutes = require("./routes/testimonials.routes.js");
const concertsRoutes = require("./routes/concerts.routes.js");
const seatsRoutes = require("./routes/seats.routes.js");

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "/client/build")));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/", testimonialRoutes);
app.use("/api/", concertsRoutes);
app.use("/api/", seatsRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.use((req, res) => {
  res.status(404).send("404 not found...");
});

const server = app.listen(process.env.PORT || 8000, () => {
  if (NODE_ENV !== "test") {
    console.log("Server is running on port: 8000");
  }
});
const io = socket(server);

io.on("connection", (socket) => {
  console.log("Client connected with ID: " + socket.id);
});

mongoose.connect(dbURI, {
  useNewUrlParser: true,
});
const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to the database");
});
db.on("error", (err) => console.log("Error " + err));

module.exports = server;
