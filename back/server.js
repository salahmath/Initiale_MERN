const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/router');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
dotenv.config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// MongoDB connection

const server = http.createServer(app);
const io = socketIo(server);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Gérer les connexions WebSocket
io.on('connection', (socket) => {
  console.log('A user connected');

  // Envoyer les anciens messages au client
  socket.on('request history', () => {
    Message.find().sort({ timestamp: 1 }).exec((err, messages) => {
      if (err) {
        console.error(err);
      } else {
        socket.emit('chat history', messages);
      }
    });
  });

  // Recevoir un nouveau message
  socket.on('chat message', (msg) => {
    const message = new Message({ text: msg });
    message.save()
      .then(() => io.emit('chat message', msg))
      .catch(err => console.error(err));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error));

  app.use('/api', authRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
