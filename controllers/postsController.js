const client = require('../config/db');

// Obtener todos los posts
exports.getAllPosts = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener posts:', err);
    res.status(500).send('Error al obtener posts');
  }
};

// Crear un nuevo post
exports.createPost = async (req, res) => {
  const { user_id, title, description, media_url, media_type } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO posts (user_id, title, description, media_url, media_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, description, media_url, media_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear el post:', err);
    res.status(500).send('Error al crear el post');
  }
};

// Obtener un post por ID
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Post no encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener el post:', err);
    res.status(500).send('Error al obtener el post');
  }
};

// Eliminar un post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Post no encontrado');
    }
    res.json({ message: 'Post eliminado', post: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar el post:', err);
    res.status(500).send('Error al eliminar el post');
  }
};
