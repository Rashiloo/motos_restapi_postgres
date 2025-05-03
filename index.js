const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// Ruta al certificado
const certPath = path.join(__dirname, 'certs', 'root.crt');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: fs.readFileSync(certPath).toString()
    }
  },
  logging: console.log // Opcional para desarrollo
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


