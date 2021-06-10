const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const chatRoutes = require("./routes/chatRoutes");
const roomRoutes = require("./routes/roomRoutes");
const socketFunctions = require("./middlewares/socketFunctions");
const _ = require("underscore");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
var io = require("socket.io")(server, {
  cors: {
    origins: [
      "http://localhost:19006",
      "https://cs396-final-project-app.vercel.app",
    ],
  },
});
app.set("socketio", io);
app.set("clients", {});

app.use(cors());

io.on("connection", (socket, next) => {
  socket.on("login", function (data) {
    console.log("a user with username " + data + " connected");
    //PRINT ALL SOCKETS
    var sockets = io.sockets.sockets;
    for (var socketIds in sockets) {
      var itemSock = sockets[socketIds];
      console.log(itemSock.id);
    }
    //ADD USER TO SOCKET CLIENTS
    if (data && data != null) {
      app.get("clients")[socket.id] = data.toLowerCase();
      console.log(app.get("clients")[socket.id]);
    }
  });

  socket.on("roomConnection", async function (data) {
    console.log("User joined room " + data);
    await socket.join(`${data}`);
    const rooms = io.sockets.adapter.rooms;
    console.log(rooms);
    await socketFunctions.sendToAll(rooms);
  });

  socket.on("roomDisconnection", async function (data) {
    console.log("User left room" + data);
    await socket.leave(`${data}`);
    const rooms = io.sockets.adapter.rooms;
    console.log(rooms);
    await socketFunctions.sendToAll(rooms);
  });

  socket.on("disconnect", (reason) => {
    console.log("user " + app.get("clients")[socket.id] + " disconnected");
    console.log(reason);
    delete app.get("clients")[socket.id];
  });

  socket.on("sendToRoom", async function (room, title, body) {
    socketFunctions.sendToRoom(room, title, body);
  });
});

app.use(bodyParser.json());
app.use(chatRoutes);
app.use(roomRoutes);

// const mongoUri = process.env.MONGO_KEY;
// mongoose.connect(mongoUri, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });
// mongoose.connection.on("connected", () => {
//   console.log("Connected to mongo instance");
// });
// mongoose.connection.on("error", (err) => {
//   console.error("Error connecting to mongo", err);
// });
