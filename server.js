const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('join', (roomId) => {
    console.log(`${socket.id} joined room ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('signal', (data) => {
    console.log('Signal received', data);
    io.to(data.to).emit('signal', {
