const express = require('express');
const uniqid = require('uniqid');
const app = express();
const socketIO = require('socket.io');

const server = app.listen(3001);

const io = socketIO(server, {
  cors: { origin: ['http://localhost:3000'] },
});

const messages = [
  { id: uniqid(), author: 'server', text: 'welcome to WildChat' },
];

io.on('connect', socket => {
  console.log('user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.emit('initialMessageList', messages);

  socket.on('messageFromClient', newMessage => {
    messages.push({ id: uniqid(), ...newMessage });
    io.emit('messageFromServer', newMessage);
  });
});
