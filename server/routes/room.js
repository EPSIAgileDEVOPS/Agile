const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Floor = require('../models/Floor');

// Route pour récupérer les salles d'un étage spécifique
router.get('/:floor_id', async (req, res) => {
    const { floor_id } = req.params;

    try {
        // Récupérer les salles associées à l'étage
        const rooms = await Room.findAll({
            where: { floor_id },
            order: [['room_number', 'ASC']] // Optionnel : trier par numéro de salle
        });

        if (rooms.length === 0) {
            return res.status(404).json({ message: 'Aucune salle trouvée pour cet étage.' });
        }

        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des salles.', error });
    }
});

module.exports = router;
