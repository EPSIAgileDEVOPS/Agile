const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Room = require('./Room');

const Equipment = sequelize.define('Equipment', {
  equipment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Room, // Nom de la table
      key: 'room_id', // Clé primaire de la table référencée
    },
  },
  equipment_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Définir la relation Equipment -> Room
Equipment.belongsTo(Room, { foreignKey: 'room_id' });
Room.hasMany(Equipment, { foreignKey: 'room_id' });


// Exporter le modèle
module.exports = Equipment;
