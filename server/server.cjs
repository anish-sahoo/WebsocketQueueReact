/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const http = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

mongoose
  .connect("mongodb://localhost:27017/queue", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

  const queueSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // Define id as unique and of type Number
    name: String,
    time: Number,
  });
  
const Queue = mongoose.model("Queue", queueSchema);

io.on("connection", (socket) => {
  // Fetch all data from the database when a client connects
  Queue.find()
    .then((persons) => {
      // Emit the fetched data to the client
      socket.emit("initialData", persons);
    })
    .catch((err) => console.error(err));

  // Handle joinQueue event as before
  socket.on("joinQueue", (newPerson) => {
    Queue.create(newPerson)
      .then(() => {
        Queue.find()
          .then((persons) => {
            io.emit("queueUpdated", persons);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  });

  // Handle resolveQueue event as before
  socket.on("resolveQueue", (queueId) => {
    console.log(queueId);
    Queue.findOneAndDelete({id: queueId})
      .then(() => {
        Queue.find()
          .then((persons) => {
            io.emit("queueUpdated", persons);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  });
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

http.listen(3000, '0.0.0.0', () => {
  console.log("Server is listening on http://10.152.208.60:3000");
});
