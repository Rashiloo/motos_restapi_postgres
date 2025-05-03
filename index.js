const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// Configuración robusta de conexión PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLROOTCERT ? {
    rejectUnauthorized: true,
    ca: process.env.PGSSLROOTCERT,
    checkServerIdentity: () => undefined // Ignora verificación de hostname
  } : false
});

// Verificación de conexión mejorada
(async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Conexión a PostgreSQL verificada');
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    console.log('\nSOLUCIÓN:');
    console.log('1. Verifica que DATABASE_URL tenga ?ssl=true&sslmode=verify-full');
    console.log('2. Revisa que PGSSLROOTCERT contenga el certificado PEM completo');
    console.log('3. Confirma que el servidor PostgreSQL esté accesible');
    process.exit(1);
  }
})();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de ejemplo
app.get('/api/motos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM motos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({
      error: 'Error en la consulta',
      ...(process.env.NODE_ENV !== 'production' && { details: err.message })
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicio del servidor
const PORT = process.env.PORT || 8900;
app.listen(PORT, () => {
  console.log(`
  🚀 Servidor activo en puerto ${PORT}
  Modo: ${process.env.NODE_ENV || 'development'}
  Conexión SSL: ${process.env.PGSSLROOTCERT ? '✅ Configurada' : '⚠️ Desactivada'}
  `);
});
