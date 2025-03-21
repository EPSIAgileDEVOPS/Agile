// models/Incident.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Reservation = require('./Reservation'); // Importer le modèle Reservation pour la relation
const User = require('./User'); // Importer le modèle User pour la relation

const Incident = sequelize.define('Incident', {
  incident_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reservation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Reservation, // Référence au modèle Reservation
      key: 'reservation_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Référence au modèle User
      key: 'user_id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  incident_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

Reservation.hasMany(Incident, { foreignKey: 'reservation_id' }); // Une réservation peut avoir plusieurs incidents
Incident.belongsTo(Reservation, { foreignKey: 'reservation_id' }); // Chaque incident est lié à une réservation

User.hasMany(Incident, { foreignKey: 'user_id' }); // Un utilisateur peut signaler plusieurs incidents
Incident.belongsTo(User, { foreignKey: 'user_id' }); // Chaque incident est signalé par un utilisateur

module.exports = Incident;
