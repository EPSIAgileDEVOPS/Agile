// models/Campus.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Campus = sequelize.define('Campus', {
  campus_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
});

module.exports = Campus;
