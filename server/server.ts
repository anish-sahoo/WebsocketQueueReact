/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

interface Person {
  id: number;
  name: string;
  time: number; // Using number for consistency with client-side type
}

mongoose.connect('mongodb://localhost:27017/queue', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

const queueSchema = new mongoose.Schema({
  name: String,
  time: Number, // Using Number for consistency
});
const Queue = mongoose.model('Queue', queueSchema);

io.on('connection', (socket) => {
  socket.on('joinQueue', (newPerson: Person) => { // Receive typed Person object
    Queue.create(newPerson)
      .then((createdPerson: Person) => { // Emit typed Person object
        io.emit('queueUpdated', createdPerson);
      })
      .catch(err => console.error(err));
  });

  socket.on('resolveQueue', (queueId: number) => {
    Queue.findByIdAndDelete(queueId)
      .then(() => {
        io.emit('queueUpdated'); // Emit to refresh client-side view
      })
      .catch(err => console.error(err));
  });
});
  