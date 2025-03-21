// models/Floor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Campus = require('./Campus'); // Importer le modèle Campus pour la relation

const Floor = sequelize.define('Floor', {
  floor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  campus_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Campus, // Référence au modèle Campus
      key: 'campus_id'
    }
  },
  floor_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Campus.hasMany(Floor, { foreignKey: 'campus_id' }); // Un campus peut avoir plusieurs étages
Floor.belongsTo(Campus, { foreignKey: 'campus_id' }); // Chaque étage appartient à un campus

module.exports = Floor;
