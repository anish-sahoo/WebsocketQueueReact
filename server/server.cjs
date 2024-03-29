/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
mongoose.connect('mongodb://localhost:27017/queue', { useNewUrlParser: true })
    .then(function () { return console.log('Connected to MongoDB'); })
    .catch(function (err) { return console.error(err); });
var queueSchema = new mongoose.Schema({
    name: String,
    time: Number, // Using Number for consistency
});
var Queue = mongoose.model('Queue', queueSchema);
io.on('connection', function (socket) {
    socket.on('joinQueue', function (newPerson) {
        Queue.create(newPerson)
            .then(function (createdPerson) {
            io.emit('queueUpdated', createdPerson);
        })
            .catch(function (err) { return console.error(err); });
    });
    socket.on('resolveQueue', function (queueId) {
        Queue.findByIdAndDelete(queueId)
            .then(function () {
            io.emit('queueUpdated'); // Emit to refresh client-side view
        })
            .catch(function (err) { return console.error(err); });
    });
});
