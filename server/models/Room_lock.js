const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Room = require('./Room');
const User = require('./User');
const Equipment = require('./Equipment'); // Assurez-vous que ce modèle est défini ailleurs

const RoomLock = sequelize.define('RoomLock', {
  lock_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Room, // Nom de la table Room
      key: 'room_id', // Clé primaire de la table Room
    },
  },
  locked_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Nom de la table User
      key: 'user_id', // Clé primaire de la table User
    },
  },
  lock_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

// Relations entre Room et Equipment
Room.hasMany(Equipment, { foreignKey: 'room_id' }); // Une salle peut avoir plusieurs équipements
Equipment.belongsTo(Room, { foreignKey: 'room_id' }); // Chaque équipement appartient à une salle

// Relations entre Room et RoomLock
Room.hasMany(RoomLock, { foreignKey: 'room_id' }); // Une salle peut avoir plusieurs RoomLock
RoomLock.belongsTo(Room, { foreignKey: 'room_id' }); // Un verrou appartient à une salle

// Relations entre User et RoomLock
User.hasMany(RoomLock, { foreignKey: 'locked_by' }); // Un utilisateur peut avoir verrouillé plusieurs salles
RoomLock.belongsTo(User, { foreignKey: 'locked_by' }); // Un verrou est associé à un utilisateur

// Exporter le modèle
module.exports = RoomLock;
