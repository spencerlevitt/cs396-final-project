const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var _ = require("underscore");
const moment = require("moment");
const socketFunctions = require("../middlewares/socketFunctions");

const router = express.Router();

router.post("/message", async (req, res) => {
  const { message, roomId } = req.body;
  try {
    await socketFunctions.sendToRoom(roomId, "messageReceived", message);
    res.send(`Message sent to ${roomId}`);
  } catch (e) {
    console.log(e);
    res.status(422).send(e.message);
  }
});

module.exports = router;
