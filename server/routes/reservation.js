const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const RoomLock = require('../models/Room_lock'); 
const User = require('../models/User');

// Route pour créer une nouvelle réservation
router.post('/', async (req, res) => {
    const { user_id, room_id, reservation_date, start_time, end_time } = req.body;

    try {
        // Vérifier la capacité de la salle
        const room = await Room.findByPk(room_id);
        if (!room) {
            return res.status(404).json({ message: 'Salle non trouvée.' });
        }

        // Vérifier si la salle est verrouillée
        const isLocked = await RoomLock.findOne({
            where: {
                room_id,
                lock_date: reservation_date
            }
        });

        if (isLocked) {
            return res.status(403).json({ message: 'Cette salle est verrouillée et ne peut pas être réservée.' });
        }

        

        // Vérification si l'utilisateur a déjà réservé la salle pour le même créneau
        const userExistingReservation = await Reservation.findOne({
            where: {
                user_id,
                room_id,
                reservation_date,
                status: 'active',
                [Op.or]: [
                    { start_time: { [Op.between]: [start_time, end_time] } },
                    { end_time: { [Op.between]: [start_time, end_time] } },
                    { [Op.and]: [{ start_time: { [Op.lte]: start_time } }, { end_time: { [Op.gte]: end_time } }] }
                ]
            }
        });

        if (userExistingReservation) {
            return res.status(400).json({ message: 'Vous avez déjà une réservation pour cette salle à ce créneau.' });
        }

        // Calculer le nombre de places déjà réservées pour cette plage horaire
        const existingReservations = await Reservation.count({
            where: {
                room_id,
                reservation_date,
                status: 'active',
                [Op.or]: [
                    { start_time: { [Op.between]: [start_time, end_time] } },
                    { end_time: { [Op.between]: [start_time, end_time] } },
                    { [Op.and]: [{ start_time: { [Op.lte]: start_time } }, { end_time: { [Op.gte]: end_time } }] }
                ]
            }
        });

        // Si le nombre de réservations atteint la capacité de la salle, refuser la réservation
        if (existingReservations >= room.capacity) {
            return res.status(400).json({ message: 'Il n\'y a plus de places disponibles pour cette salle.' });
        }

        // Créer la réservation
        const newReservation = await Reservation.create({
            user_id,
            room_id,
            reservation_date,
            start_time,
            end_time
        });

        res.status(201).json({ message: 'Réservation créée avec succès.', reservation: newReservation });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la réservation.', error });
    }
});

// Route pour annuler une réservation
router.delete('/:reservation_id', async (req, res) => {
    const { reservation_id } = req.params;

    try {
        // Trouver la réservation par son ID
        const reservation = await Reservation.findByPk(reservation_id);

        // Vérifier si la réservation existe
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée.' });
        }

        // Supprimer la réservation de la base de données
        await reservation.destroy();

        res.status(200).json({ message: 'Réservation annulée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'annulation de la réservation.', error });
    }
});


// Route pour récupérer toutes les réservations d'une salle pour un jour spécifique
router.get('/room/:room_id/date/:reservation_date', async (req, res) => {
    const { room_id, reservation_date } = req.params;

    try {
        const reservations = await Reservation.findAll({
            where: {
                room_id,
                reservation_date,
                status: 'active'
            },
            include: [{ model: User, attributes: ['name'] }] // Inclure les informations de l'utilisateur ayant fait la réservation
        });

        if (reservations.length === 0) {
            return res.status(404).json({ message: 'Aucune réservation trouvée pour cette salle à cette date.' });
        }

        res.status(200).json({ reservations });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des réservations.', error });
    }
});

module.exports = router;
