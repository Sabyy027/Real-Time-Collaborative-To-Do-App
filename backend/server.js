import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST", "PUT", "DELETE"] }));
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
