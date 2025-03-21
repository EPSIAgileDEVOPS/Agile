// models/Reservation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Importer le modèle User pour la relation
const Room = require('./Room'); // Importer le modèle Room pour la relation

const Reservation = sequelize.define('Reservation', {
  reservation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Référence au modèle User
      key: 'user_id'
    }
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Room, // Référence au modèle Room
      key: 'room_id'
    }
  },
  reservation_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled'),
    allowNull: false,
    defaultValue: 'active'
  }
});

User.hasMany(Reservation, { foreignKey: 'user_id' }); // Un utilisateur peut avoir plusieurs réservations
Reservation.belongsTo(User, { foreignKey: 'user_id' }); // Chaque réservation appartient à un utilisateur

Room.hasMany(Reservation, { foreignKey: 'room_id' }); // Une salle peut avoir plusieurs réservations
Reservation.belongsTo(Room, { foreignKey: 'room_id' }); // Chaque réservation est liée à une salle

module.exports = Reservation;
