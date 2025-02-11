const client = require('../config/db');

// Obtener todos los puntos
exports.getAllPuntos = async (req, res) => {
  try {
    const resultado = await client.query('SELECT * FROM puntos');
    res.json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener puntos:', err);
    res.status(500).send('Error al obtener puntos');
  }
};

// Crear puntos para un usuario
exports.createPunto = async (req, res) => {
  const { usuario_id, reto_id, puntos } = req.body;
  try {
    const resultado = await client.query(
      'INSERT INTO puntos (usuario_id, reto_id, puntos) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, reto_id, puntos]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al asignar puntos:', err);
    res.status(500).send('Error al asignar puntos');
  }
};
