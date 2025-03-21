// config/database.js

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nom de la base de données
  process.env.DB_USER,      // Utilisateur
  process.env.DB_PASSWORD,  // Mot de passe
  {
    host: process.env.DB_HOST,  // Hôte (ex: localhost)
    dialect: 'mysql',
  }
);

module.exports = sequelize;
