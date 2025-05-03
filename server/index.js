const cors = require('cors');
const express = require('express');
const path = require('path');  // Necesario para servir archivos estáticos
const routes = require('../routes');
const db = require('../database/models');

const server = express();

// 1. Configuración CORS
server.use(cors());
server.options('*', cors());

// 2. Middlewares
server.use(express.json());

// 3. Servir el frontend estático PRIMERO
server.use(express.static(path.join(__dirname, '../../public')));

// 4. Conexión a la base de datos
db.sequelize.sync()
  .then(() => console.log('✔ Base de datos conectada'))
  .catch(err => console.error('✖ Error de conexión a DB:', err));

// 5. Rutas API (se montan después del frontend)
server.use('/api', routes);

// 6. Catch-all para SPA (opcional)
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = server;
