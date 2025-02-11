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

// Obtener un video por ID
exports.getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await client.query('SELECT * FROM videosretos WHERE id = $1', [id]);
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
