const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Importer le modèle User pour la relation

const UserBan = sequelize.define('UserBan', {
  ban_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Modèle User référencé
      key: 'user_id', // Clé primaire du modèle User
    },
  },
  banned_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Modèle User référencé pour l'administrateur
      key: 'user_id', // Clé primaire du modèle User (l'administrateur)
    },
  },
  ban_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ban_reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Définir les relations
User.hasMany(UserBan, { foreignKey: 'user_id', as: 'bans' }); // Un utilisateur peut avoir plusieurs bannissements
UserBan.belongsTo(User, { foreignKey: 'user_id', as: 'bannedUser' }); // Un bannissement est lié à un utilisateur spécifique

// Relation pour l'administrateur qui bannit l'utilisateur
User.hasMany(UserBan, { foreignKey: 'banned_by', as: 'bannedUsers' }); // Un admin peut bannir plusieurs utilisateurs
UserBan.belongsTo(User, { foreignKey: 'banned_by', as: 'bannedByAdmin' }); // Un bannissement est effectué par un administrateur spécifique

// Exporter le modèle
module.exports = UserBan;
