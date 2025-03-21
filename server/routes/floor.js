// routes/floor.js
const express = require('express');
const router = express.Router();
const Floor = require('../models/Floor');
const Campus = require('../models/Campus');

// Route pour récupérer les étages d'un campus spécifique
router.get('/:campus_id', async (req, res) => {
    const { campus_id } = req.params;

    try {
        // Récupérer les étages associés au campus
        const floors = await Floor.findAll({
            where: { campus_id },
            order: [['floor_number', 'ASC']], // Optionnel : trier par numéro d'étage
            include: [{ model: Campus, attributes: ['name'] }] // Inclure les informations du campus si besoin
        });

        if (floors.length === 0) {
            return res.status(404).json({ message: 'Aucun étage trouvé pour ce campus.' });
        }

        res.status(200).json({ floors });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des étages.', error });
    }  
});

module.exports = router;
