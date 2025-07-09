const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');

dotenv.config();

const app = express();
const server = http.createServer(app);

// --- THIS IS THE FIX ---
// We are updating the cors options to allow any origin.
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any origin for WebSockets
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors()); // This now allows all origins for standard API requests (GET, POST, etc.)
// ----------------------

app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(`Error: ${err.message}`));

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

io.on('connection', (socket) => {
  console.log('A user connected with socket id:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
