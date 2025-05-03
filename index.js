const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');

// Configura Express
const app = express();

// Conexión a PostgreSQL (Aiven) con SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URL de Aiven (configurada en Render)
  ssl: {
    rejectUnauthorized: true, // Habilita verificación SSL
    ca: fs.readFileSync(path.join(__dirname, 'certs', 'ca.pem')).toString() // Ruta al certificado
  }
});

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Sirve el frontend

// API: Ejemplo de ruta para obtener motos
app.get('/api/motos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM motos');
    res.json({ motos: rows });
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error al obtener motos' });
  }
});

// API: Agrega más rutas (POST, PUT, DELETE) según necesites...

// Redirige todas las rutas no-API al frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia el servidor
const PORT = process.env.PORT || 8900;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log(`Base de datos: ${pool ? 'Conectada' : 'Error'}`);
});
