const client = require('../config/db');

exports.addLike = async (req, res) => {
  const { post_id, user_id } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)  ON CONFLICT (post_id, user_id) DO NOTHING
       RETURNING *`,
      [post_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'Ya habías dado like' });
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al dar like:', err);
    res.status(500).json({ error: 'Error al dar like' });
  }
};

exports.getLikesByPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.query.user_id; 
  
    try {
      const countResult = await client.query(
        `SELECT COUNT(*) AS likes_count
         FROM post_likes
         WHERE post_id = $1`,
        [postId]
      );
      const likesCount = parseInt(countResult.rows[0].likes_count, 10);
  
      let userLiked = false;
      if (userId) {
        const existResult = await client.query(
          `SELECT 1
           FROM post_likes
           WHERE post_id = $1 AND user_id = $2`,
          [postId, userId]
        );
        userLiked = existResult.rows.length > 0;
      }
  
      res.json({ post_id: parseInt(postId,10), likes_count: likesCount, user_liked: userLiked });
    } catch (err) {
      console.error('Error al obtener likes:', err);
      res.status(500).json({ error: 'Error al obtener likes' });
    }
  };

exports.removeLike = async (req, res) => {
  const { post_id, user_id } = req.body;

  try {
    await client.query(
      `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`,
      [post_id, user_id]
    );
    res.status(200).json({ message: 'Like eliminado' });
  } catch (err) {
    console.error('Error al eliminar like:', err);
    res.status(500).json({ error: 'Error al eliminar like' });
  }
};
