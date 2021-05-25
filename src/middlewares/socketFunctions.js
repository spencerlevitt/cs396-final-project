const express = require("express");
const mongoose = require("mongoose");
var _ = require("underscore");
//const User = mongoose.model("User");

module.exports = {
  viewSocks: function () {
    console.log("VIEWING SOCKS");
    var socketio = app.get("socketio");
    var toReturn = [];
    var sockets = socketio.sockets.sockets;
    for (var socketIds in sockets) {
      var socket = sockets[socketIds];
      console.log(socket.id);
      toReturn.push(socket.id);
    }
    const keys = _.allKeys(app.get("clients"));
    const values = _.values(app.get("clients"));
    return { iDs: toReturn, keys: keys, values: values };
  },
  sendToAll: function (title, body, alert) {
    try {
      var socketio = app.get("socketio");
      socketio.emit(title, { body: body, alert: alert });
    } catch (err) {
      console.log("sendToAll");
      console.log(err);
    }
  },
  sendToRoom: function (roomId, title, body) {
    try {
      var socketio = app.get("socketio");
      socketio.to(`${roomId}`).emit(title, { body: body });
    } catch (err) {
      console.log("Error sendToRoom");
      console.log(err);
    }
  },
  sendSockReq: function (req, title, body, alert) {
    try {
      var socketio = app.get("socketio");
      const socketId = _.invert(app.get("clients"))[
        req.user.email.toLowerCase()
      ];
      if (typeof socketId !== "undefined" && socketId) {
        socketio.to(socketId).emit(title, { body: body, alert: alert });
      }
    } catch (err) {
      console.log("sendSockReq");
      console.log(err);
    }
  },
  sendSockID: async function (id, title, body, alert) {
    try {
      var socketio = app.get("socketio");
      const user = await User.findById({
        _id: id,
      });
      console.log("CLIENTS");
      console.log(Object.values(app.get("clients")));
      const socketId = _.invert(app.get("clients"))[user.email.toLowerCase()];
      if (typeof socketId !== "undefined" && socketId) {
        socketio.to(socketId).emit(title, { body: body, alert: alert });
      }
    } catch (err) {
      console.log("sendSockID");
      console.log(err);
    }
  },
};
