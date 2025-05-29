const client = require('../config/db');

// Obtener todos los videos
exports.getAllVideos = async (req, res) => {
  try {
    const resultado = await client.query('SELECT * FROM videosretos');
    res.json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener videos:', err);
    res.status(500).send('Error al obtener videos');
  }
};

exports.getVideoById = async (req, res) => {
  const { usuario_id, reto_id } = req.params; // Ahora también se recibe el reto_id
  try {
    // Modificamos la consulta SQL para que busque por 'id' y 'reto_id'
    const resultado = await client.query('SELECT video_url FROM videosretos WHERE usuario_id = $1 AND reto_id = $2', [usuario_id, reto_id]);

    if (resultado.rows.length === 0) {
      return res.status(404).send('Video no encontrado');
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al obtener el video:', err);
    res.status(500).send('Error al obtener el video');
  }
};


// Crear un nuevo video
exports.createVideo = async (req, res) => {
  const { usuario_id, reto_id, video_url, fecha } = req.body;
  try {
    const resultado = await client.query(
      'INSERT INTO videosretos (usuario_id, reto_id, video_url, fecha) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario_id, reto_id, video_url, fecha]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al crear video:', err);
    res.status(500).send('Error al crear video');
  }
};

// Actualizar un video
exports.updateVideo = async (req, res) => {
  const { id } = req.params;
  const { usuario_id, reto_id, video_url, fecha } = req.body;

  try {
    const resultado = await client.query(
      'UPDATE videosretos SET usuario_id = $1, reto_id = $2, video_url = $3, fecha = $4 WHERE id = $5 RETURNING *',
      [usuario_id, reto_id, video_url, fecha, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).send('Video no encontrado');
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Error al actualizar video:', err);
    res.status(500).send('Error al actualizar video');
  }
};


// Eliminar un video
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await client.query('DELETE FROM videosretos WHERE id = $1 RETURNING *', [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).send('Video no encontrado');
    }

    res.json({ mensaje: 'Video eliminado', video: resultado.rows[0] });
  } catch (err) {
    console.error('Error al eliminar video:', err);
    res.status(500).send('Error al eliminar video');
  }
};

exports.aprobarVideo = async (req, res) => {
  const { usuario_id, reto_id } = req.params;
  try {
    const resultado = await client.query(
      'UPDATE videosretos SET estado = $1 WHERE usuario_id = $2 AND reto_id = $3 AND estado = $4 RETURNING *',
      ['aprobado', usuario_id, reto_id, 'pendiente']
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron videos pendientes para este usuario y reto' });
    }

    res.json({ mensaje: `${resultado.rowCount} video(s) actualizado(s)`, estado: 'aprobado' });
  } catch (err) {
    console.error('Error al aprobar video:', err);
    res.status(500).send('Error al aprobar video');
  }
};


exports.suspenderVideo = async (req, res) => {
  const { usuario_id, reto_id } = req.params;
  try {
    const resultado = await client.query(
      'UPDATE videosretos SET estado = $1 WHERE usuario_id = $2 AND reto_id = $3 AND estado = $4 RETURNING *',
      ['suspendido', usuario_id, reto_id, 'pendiente']
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron videos pendientes para este usuario y reto' });
    }

    res.json({ mensaje: `${resultado.rowCount} video(s) actualizado(s)`, estado: 'suspendido' });
  } catch (err) {
    console.error('Error al suspender video:', err);
    res.status(500).send('Error al suspender video');
  }
};

exports.getPendingVideos = async (req, res) => {
  try {
    const resultado = await client.query('SELECT * FROM videosretos WHERE estado = $1', ['pendiente']);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener videos pendientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener videos pendientes' });
  }
};

exports.getEstadoReto = async (req, res) => {
  const { reto_id, usuario_id } = req.params;
  try {
    const estado = await client.query(
      'SELECT estado FROM videosretos WHERE reto_id = $1 AND usuario_id = $2',
      [reto_id, usuario_id]
    );

    if (estado.rows.length > 0) {
      res.json({ estado: estado.rows[0].estado });
    } else {
      res.status(404).json({ message: 'Reto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el estado del reto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};