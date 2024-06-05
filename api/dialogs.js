const { DialogModel } = require("../models/DialogModel");
const { MessageModel } = require("../models/MessageModel");
const { User } = require("../models");
const { Op } = require("sequelize");

const getAllDialogs = (req, res) => {
  const { userId } = req.query;
  DialogModel.findAll({
    where: { [Op.or]: [{ authorId: userId }, { partnerId: userId }] },
    include: [
      { model: User, attributes: ["username", "img"], as: "author" },
      { model: User, attributes: ["username", "img"], as: "partner" },
      { model: MessageModel },
    ],
  })
    .then((data) => res.json(data))
    .catch((err) => res.status(404).json(err));
};

const createDialog = (req, res) => {
  const { authorId, partnerId, newMessage } = req.body;
  DialogModel.create({ authorId: authorId, partnerId: partnerId })
    .then((data) =>
      MessageModel.create({
        dialogId: data.id,
        authorId: authorId,
        partnerId: partnerId,
        text: newMessage,
      }).then((message) =>
        DialogModel.update(
          { lastMessage: message.id },
          { where: { id: message.dialogId } }
        )
          .then((dialogData) => res.json(dialogData))
          .catch((err) => res.status(404).json(err))
      )
    )
    .catch((err) => res.status(403).json(err));
};

const deleteDialog = (req, res) => {
  const { dialogId } = req.query;
};

module.exports = { getAllDialogs, createDialog, deleteDialog };
