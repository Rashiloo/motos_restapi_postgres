const { Router } = require('express');
const controllers = require('../controllers');

const router = Router();

// Ruta de bienvenida
router.get('/', (req, res) => res.send('API de Motos - Bienvenido'));

// Rutas CRUD para motos
router.post('/motos', controllers.createMoto);       // Crear nueva moto
router.get('/motos', controllers.getAllMotos);       // Obtener todas las motos
router.get('/motos/:id', controllers.getMotoById);   // Obtener una moto específica
router.put('/motos/:id', controllers.updateMoto);    // Actualizar una moto
router.delete('/motos/:id', controllers.deleteMoto); // Eliminar una moto

module.exports = router;
