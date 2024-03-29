/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: Number, required: true },
});

// Create a MongoDB model for Person
const Person = mongoose.model("Person", personSchema);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/queue", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// WebSocket connection handling
io.on("connection", (socket) => {
  // Send current queue to the newly connected client
  getQueueFromDB()
    .then((queue) => {
      socket.emit("updateQueue", queue);
    })
    .catch((err) => {
      console.error("Error fetching queue:", err);
    });

  // Handle user joining the queue
  socket.on("joinQueue", (user) => {
    const { name, time } = user;
    const newPerson = new Person({ name, time });
    newPerson
      .save()
      .then(() => {
        return getQueueFromDB();
      })
      .then((queue) => {
        io.emit("updateQueue", queue);
      })
      .catch((err) => {
        console.error("Error joining queue:", err);
      });
  });

  // Handle admin removing a user from the queue
  socket.on("removeFromQueue", () => {
    Person.findOneAndDelete({}, { sort: { time: 1 } }) // Remove the first person in the queue
      .then(() => {
        return getQueueFromDB();
      })
      .then((queue) => {
        io.emit("updateQueue", queue);
      })
      .catch((err) => {
        console.error("Error removing from queue:", err);
      });
  });
});

// Function to fetch queue from the database
const getQueueFromDB = () => {
  return Person.find().sort({ time: 1 }).exec();
};

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
