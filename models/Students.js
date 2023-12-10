const { DataTypes } = require("sequelize");
const db = require("../db/index");

const Student = db.define("Student", {
  roll_no: {
    type: DataTypes.NUMBER,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  reg_no: {
    type: DataTypes.STRING,
  },
  eiin: {
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
  fathers_name: {
    type: DataTypes.STRING,
  },
  mothers_name: {
    type: DataTypes.STRING,
  },
  group: {
    type: DataTypes.STRING,
  },
  session: {
    type: DataTypes.STRING,
  },
  institute: {
    type: DataTypes.STRING,
  },
  result: {
    type: DataTypes.STRING,
  },
  center: {
    type: DataTypes.STRING,
  },
  result_data: {
    type: DataTypes.STRING,
  },
});

module.exports = Student;
