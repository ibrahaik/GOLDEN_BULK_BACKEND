const client = require('../config/db');

exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await client.query(
      `SELECT pc.id, pc.post_id, pc.user_id, u.nombre AS user_name, pc.text, pc.created_at
       FROM post_comments pc
       JOIN usuarios u ON u.id = pc.user_id
       WHERE pc.post_id = $1
       ORDER BY pc.created_at ASC`,
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener comentarios:', err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

exports.addComment = async (req, res) => {
  const { post_id, user_id, text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'El campo text es obligatorio' });
  }
  try {
    const result = await client.query(
      `INSERT INTO post_comments (post_id, user_id, text)
       VALUES ($1, $2, $3)
       RETURNING id, post_id, user_id, text, created_at`,
      [post_id, user_id, text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear comentario:', err);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
};
