const { DataTypes } = require("sequelize");
const { User } = require("./UserModel");
const { sequelize } = require("../db");
const { MessageModel } = require("./MessageModel");

const DialogModel = sequelize.define(
  "dialog",
  {
    authorId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    lastMessage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "dialogs",
    timestamps: false,
  }
);

DialogModel.belongsTo(User, { as: "author", foreignKey: "authorId" });
DialogModel.belongsTo(User, { as: "partner", foreignKey: "partnerId" });
DialogModel.belongsTo(MessageModel, { foreignKey: "lastMessage" });

module.exports = { DialogModel };
