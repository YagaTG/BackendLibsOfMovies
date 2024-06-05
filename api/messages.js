const { MessageModel } = require("../models");

const { Server } = require("socket.io");
const { server } = require("../server");
const io = new Server(server, {
  cors: {
    origin: "http://192.168.0.102:5173",
    methods: ["GET", "POST"],
  },
});

const getDialogMessages = (req, res) => {
  const { dialogId } = req.query;
  MessageModel.findAll({ where: { dialogId: dialogId } })
    .then((data) => res.json(data))
    .catch((err) => res.status(404).json(err));
};

const postMessage = (req, res) => {
  console.log(123);
  const { dialogId, authorId, partnerId, text } = req.body;
  MessageModel.create({ dialogId, authorId, partnerId, text })
    .then((data) => {
      io.emit("SERVER:NEW_MESSAGE");
      return res.json({ status: "succes" });
    })
    .catch((err) => res.status(404).json(err));
};

const deleteMessage = (req, res) => {
  const { messageId } = req.query;
};

module.exports = { getDialogMessages, postMessage };
