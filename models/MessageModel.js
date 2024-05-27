const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");



const MessageModel = sequelize.define(
  "message",
  {
    dialogId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    unread: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "messages",
  }
);

module.exports = { MessageModel };
