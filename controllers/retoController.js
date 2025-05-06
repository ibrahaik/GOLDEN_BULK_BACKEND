const client = require('../config/db');

exports.getAllRetos = async (req, res) => {
  try {
    const resultado = await client.query('SELECT * FROM retos');
    res.json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener retos:', err);
    res.status(500).send('Error al obtener retos');
  }
};

exports.getRetoById = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await client.query('SELECT * FROM retos WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).send('Reto no encontrado');
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al obtener el reto:', err);
    res.status(500).send('Error al obtener el reto');
  }
};

exports.createReto = async (req, res) => {
  const { nombre, descripcion, fecha_inicio, fecha_fin, puntos, comunidad_id } = req.body;
  try {
    const resultado = await client.query(
      'INSERT INTO retos (nombre, descripcion, fecha_inicio, fecha_fin, puntos, comunidad_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, descripcion, fecha_inicio, fecha_fin, puntos, comunidad_id]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al crear reto:', err);
    res.status(500).send('Error al crear reto');
  }
};

exports.updateReto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fecha_inicio, fecha_fin, puntos, comunidad_id } = req.body;
  try {
    const resultado = await client.query(
      'UPDATE retos SET nombre = $1, descripcion = $2, fecha_inicio = $3, fecha_fin = $4, puntos = $5, comunidad_id = $6 WHERE id = $7 RETURNING *',
      [nombre, descripcion, fecha_inicio, fecha_fin, puntos, comunidad_id, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).send('Reto no encontrado');
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al actualizar reto:', err);
    res.status(500).send('Error al actualizar reto');
  }
};

exports.deleteReto = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await client.query('DELETE FROM retos WHERE id = $1 RETURNING *', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).send('Reto no encontrado');
    }
    res.json({ mensaje: 'Reto eliminado', reto: resultado.rows[0] });
  } catch (err) {
    console.error('Error al eliminar reto:', err);
    res.status(500).send('Error al eliminar reto');
  }
};
