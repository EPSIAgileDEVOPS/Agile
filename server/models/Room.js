// models/Room.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Floor = require('./Floor'); // Importer le modèle Floor pour la relation

const Room = sequelize.define('Room', {
  room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  floor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Floor, // Référence au modèle Floor
      key: 'floor_id'
    }
  },
  room_number: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  equipment: {
    type: DataTypes.TEXT,
    allowNull: true // L'équipement peut être optionnel
  }
});

Floor.hasMany(Room, { foreignKey: 'floor_id' }); // Un étage peut avoir plusieurs salles
Room.belongsTo(Floor, { foreignKey: 'floor_id' }); // Chaque salle appartient à un étage

module.exports = Room;
