const client = require('../config/db');

 
// Obtener todas las comunidades
exports.getAllComunidades = async (req, res) => {
  try {
    const resultado = await client.query('SELECT * FROM comunidades');
    res.json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener comunidades:', err);
    res.status(500).send('Error al obtener comunidades');
  }
};

// Obtener una comunidad por ID
exports.getComunidadById = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await client.query('SELECT * FROM comunidades WHERE id = $1', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).send('Comunidad no encontrada');
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al obtener la comunidad:', err);
    res.status(500).send('Error al obtener la comunidad');
  }
};

// Crear una nueva comunidad
exports.createComunidad = async (req, res) => {
  const { nombre, pais, ciudad } = req.body;
  try {
    const resultado = await client.query(
      'INSERT INTO comunidades (nombre, pais, ciudad) VALUES ($1, $2, $3) RETURNING *',
      [nombre, pais, ciudad]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al crear comunidad:', err);
    res.status(500).send('Error al crear comunidad');
  }
};

// Actualizar una comunidad
exports.updateComunidad = async (req, res) => {
  const { id } = req.params;
  const { nombre, pais, ciudad } = req.body;
  try {
    const resultado = await client.query(
      'UPDATE comunidades SET nombre = $1, pais = $2, ciudad = $3 WHERE id = $4 RETURNING *',
      [nombre, pais, ciudad, id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).send('Comunidad no encontrada');
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al actualizar comunidad:', err);
    res.status(500).send('Error al actualizar comunidad');
  }
};

// Eliminar una comunidad
exports.deleteComunidad = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await client.query('DELETE FROM comunidades WHERE id = $1 RETURNING *', [id]);
    if (resultado.rows.length === 0) {
      return res.status(404).send('Comunidad no encontrada');
    }
    res.json({ mensaje: 'Comunidad eliminada', comunidad: resultado.rows[0] });
  } catch (err) {
    console.error('Error al eliminar comunidad:', err);
    res.status(500).send('Error al eliminar comunidad');
  }
};
