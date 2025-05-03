const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const fs = require('fs');

// Configura Express
const app = express();

// Verifica que el certificado exista antes de crear el Pool
const certPath = path.join(__dirname, 'certs', 'ca.pem');
if (!fs.existsSync(certPath)) {
  console.error('ERROR: No se encontró el certificado SSL en', certPath);
  process.exit(1);
}

// Conexión a PostgreSQL (Aiven) con SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URL de Aiven (configurada en Render)
  ssl: {
    rejectUnauthorized: true, // Habilita verificación SSL
    ca: fs.readFileSync(certPath).toString() // Usa tu archivo ca.pem
  }
});

// Verificación de conexión a la base de datos al iniciar
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexión a PostgreSQL verificada');
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    console.log('Verifica que:');
    console.log('1. El certificado ca.pem esté en /certs/');
    console.log('2. DATABASE_URL tenga ?ssl=true');
    console.log('3. El certificado coincida con el de Aiven');
    process.exit(1);
  }
})();

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
    res.status(500).json({ 
      error: 'Error al obtener motos',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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
  console.log(`\nServidor en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Certificado SSL: ${certPath}`);
});
