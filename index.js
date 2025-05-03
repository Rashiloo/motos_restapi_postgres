const express = require('express');
const path = require('path');
const { Pool } = require('pg');

// Configura Express
const app = express();

// Conexión a PostgreSQL (Aiven) con SSL via variables de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLROOTCERT ? {
    rejectUnauthorized: true,
    ca: process.env.PGSSLROOTCERT  // Certificado desde variable de entorno
  } : false
});

// Verificación de conexión mejorada
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexión a PostgreSQL verificada');
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    console.log('Soluciona esto:');
    console.log('1. Verifica DATABASE_URL en Render');
    console.log('2. Revisa PGSSLROOTCERT (debe incluir BEGIN/END CERTIFICATE)');
    console.log('3. Asegúrate que la BD acepte conexiones SSL');
    process.exit(1);
  }
})();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: Ejemplo de ruta para obtener motos
app.get('/api/motos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM motos');
    res.json({ motos: rows });
  } catch (err) {
    const errorResponse = {
      error: 'Error al obtener motos',
      ...(process.env.NODE_ENV === 'development' && { 
        details: err.message,
        stack: err.stack 
      })
    };
    res.status(500).json(errorResponse);
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Inicia el servidor
const PORT = process.env.PORT || 8900;
app.listen(PORT, () => {
  console.log(`
  🚀 Servidor listo en http://localhost:${PORT}
  Entorno: ${process.env.NODE_ENV || 'development'}
  SSL: ${process.env.PGSSLROOTCERT ? 'Configurado' : 'No configurado'}
  `);
});
