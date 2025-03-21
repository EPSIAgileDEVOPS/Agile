const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Charger les variables d'environnement
dotenv.config();

// Charger les modèles
const User = require('./models/User');
const Campus = require('./models/Campus');
const Floor = require('./models/Floor');
const Room = require('./models/Room');
const Reservation = require('./models/Reservation');
const Incident = require('./models/Incident');
const Equipment = require('./models/Equipment');
const RoomLock = require('./models/Room_lock');
const UserBan = require('./models/User_bans');

// Charger les routes
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservation'); // Importer les routes de réservation
const floorRoutes = require('./routes/floor');
const roomRoutes = require('./routes/room');
const equipmentRoutes = require('./routes/equipment');

const app = express();

// Middleware de sécurité
app.use(cors({
  origin: ['https://campusconnect.ethanfoutry.com', 'http://localhost:3000', ''] // Configurer les domaines autorisés
}));
app.use(helmet());
app.use(express.json()); 

// Tester la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie.');
    // Synchroniser les modèles avec la base de données
    sequelize.sync({ force: false }) // Mettre à jour la base de données sans écraser les données existantes
    .then(() => {
        console.log('Synchronisation des modèles réussie.');
    })
    .catch((error) => {
        console.error('Erreur lors de la synchronisation des modèles:', error);
    });
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données:', err);
  });

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes); 
app.use('/api/floors', floorRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/equipment', roomRoutes);
// Route de base
app.get('/', (req, res) => {
  res.send('Bienvenue sur Campus Connect');
});

// Démarrer le serveur
const PORT =  3000; //process.env.PORT ||
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port http://localhost:${PORT}`);
});
