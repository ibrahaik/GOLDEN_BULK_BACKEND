const client = require('../config/db');

const crearInformacion = async (req, res) => {
  const { user_id, nombre_completo, direccion_envio } = req.body;

  if (!user_id || !nombre_completo || !direccion_envio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const query = `
      INSERT INTO informacion_usuario (user_id, nombre_completo, direccion_envio)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [user_id, nombre_completo, direccion_envio];
    const result = await client.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al insertar información:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerInformacionPorUsuario = async (req, res) => {
  const { user_id } = req.params;

  try {
    const query = `
      SELECT * FROM informacion_usuario
      WHERE user_id = $1;
    `;
    const result = await client.query(query, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Información no encontrada para este usuario' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener información:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarInformacion = async (req, res) => {
  const { user_id } = req.params;
  const { nombre_completo, direccion_envio } = req.body;

  if (!nombre_completo || !direccion_envio) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const query = `
      UPDATE informacion_usuario
      SET nombre_completo = $1,
          direccion_envio = $2
      WHERE user_id = $3
      RETURNING *;
    `;
    const values = [nombre_completo, direccion_envio, user_id];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontró información para actualizar' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar información:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


module.exports = {
  crearInformacion,
  obtenerInformacionPorUsuario,
  actualizarInformacion
};
