const db = require('./config/db');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, 'Walking_33');
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Autenticación fallida'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Nuevo usuario conectado: ${socket.user.nombre} (${socket.id})`);

    socket.on('joinCommunity', async (communityId) => {
      try {
        const membership = await db.query(
          `SELECT 1 FROM usuarios 
           WHERE id = $1 AND comunidad_id = $2`,
          [socket.user.id, communityId]
        );
        
        if (membership.rows.length === 0) {
          return socket.emit('error', 'No perteneces a esta comunidad');
        }

        socket.join(communityId);
        console.log(`🏘️ ${socket.user.nombre} unido a comunidad ${communityId}`);

        const history = await db.query(
          `SELECT u.nombre as sender, c.message, c.created_at 
           FROM chat c
           JOIN usuarios u ON c.user_id = u.id
           WHERE c.community_id = $1
           ORDER BY c.created_at DESC
           LIMIT 50`,
          [communityId]
        );

        socket.emit('chatHistory', history.rows.reverse());
      } catch (error) {
        console.error('Error en joinCommunity:', error);
        socket.emit('error', 'Error al cargar el chat');
      }
    });

    socket.on('sendMessage', async ({ message }, callback) => {
      try {
        if (!message || message.trim().length === 0) {
          return callback({ status: 'error', message: 'Mensaje vacío' });
        }

        const { rows } = await db.query(
          `INSERT INTO chat 
           (community_id, user_id, message) 
           VALUES ($1, $2, $3)
           RETURNING id, created_at`,
          [socket.user.comunidad_id, socket.user.id, message.trim()]
        );

        const fullMessage = {
          id: rows[0].id,
          sender: socket.user.nombre,
          message: message.trim(),
          created_at: rows[0].created_at,
          status: 'delivered'
        };

        io.to(socket.user.comunidad_id).emit('receiveMessage', fullMessage);
        callback({ status: 'ok' });

      } catch (error) {
        console.error('Error en sendMessage:', error);
        callback({ status: 'error', message: 'Error al enviar' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 ${socket.user.nombre} desconectado`);
    });
  });
};