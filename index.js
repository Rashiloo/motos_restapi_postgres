// index.js
const express = require('express');
const fs = require('fs');
const { Sequelize } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

// Configurar Sequelize con SSL usando certificado desde archivo
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: fs.readFileSync('/etc/ssl/certs/root.crt').toString(),
    },
  },
});

// Test de conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

app.get('/', (req, res) => {
  res.send('API funcionando correctamente 🚀');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});


