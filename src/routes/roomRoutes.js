const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var _ = require("underscore");
const moment = require("moment");
const socketFunctions = require("../middlewares/socketFunctions");

const router = express.Router();

router.get("/open-rooms", async (req, res) => {
  try {
    const socketio = app.get("socketio");
    const rooms = socketio.sockets.adapter.rooms;
    res.send(rooms);
  } catch (e) {
    console.log(e);
    res.status(422).send(e.message);
  }
});

module.exports = router;
