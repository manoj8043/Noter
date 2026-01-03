const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now, restrict in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/noter")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/tasks", require("./routes/tasks"));
// app.use('/api/calendar', require('./routes/calendar')); // To be implemented(Pending frontend)

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible in routes
app.set("io", io);

const PORT = process.env.PORT || 5001;

// Check if certificates exist for HTTPS
const fs = require('fs');
const path = require('path');

let httpsOptions = null;
try {
  httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
  };
} catch (e) {
  console.log('No SSL certificates found, falling back to HTTP (or use openssl to generate)');
}

if (httpsOptions) {
  const https = require('https');
  const httpsServer = https.createServer(httpsOptions, app);
  // Re-attach socket.io to the new https server if needed, but 'io' was attached to 'server' which is http
  // We need to decide: Are we replacing http with https or running both?
  // Let's replace 'server' with https server for the main entry point if certs exist.
  
  // Actually, 'server' variable above was used for socket.io. 
  // Let's refactor slightly to support switching.
   
  // NOTE: For simplicity in this edit, I will just start the HTTPS server listening if certs exist, 
  // and attach IO to it.
  
  io.attach(httpsServer);
  httpsServer.listen(PORT, () => console.log(`Secure Server running on port ${PORT}`));
} else {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
