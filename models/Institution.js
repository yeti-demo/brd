const { DataTypes } = require("sequelize");
const db = require("../db/index");

const Institution = db.define("Institution", {
  eiin: {
    type: DataTypes.NUMBER,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  zilla: {
    type: DataTypes.STRING,
  },
  upazilla: {
    type: DataTypes.STRING,
  },
});

module.exports = Institution;
