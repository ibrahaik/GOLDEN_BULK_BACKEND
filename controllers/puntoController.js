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

// Crear transacción de puntos (positivo o negativo) para un usuario
exports.createPunto = async (req, res) => {
  const { usuario_id, cantidad } = req.body;
  try {
    const resultado = await client.query(
      `INSERT INTO puntos (usuario_id, cantidad, fecha)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [usuario_id, cantidad]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al asignar puntos:', err);
    res.status(500).send('Error al asignar puntos');
  }
};

// Obtener el balance total de puntos de un usuario
exports.getBalance = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const { rows } = await client.query(
      `SELECT COALESCE(SUM(cantidad), 0) AS total_puntos
       FROM puntos
       WHERE usuario_id = $1`,
      [usuario_id]
    );
    res.json({ usuario_id, total_puntos: rows[0].total_puntos });
  } catch (err) {
    console.error('Error al obtener balance de puntos:', err);
    res.status(500).send('Error al obtener balance de puntos');
  }
};
