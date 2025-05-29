const client = require('../config/db');


exports.comprarProducto = async (req, res) => {
    const { usuario_id, producto_id } = req.body;
  
    try {
      await client.query('BEGIN');
  
      // 1. Verificar si el producto existe y tiene stock
      const { rows: productoRows } = await client.query(
        `SELECT * FROM productos WHERE id = $1 FOR UPDATE`,
        [producto_id]
      );
      const producto = productoRows[0];
  
      if (!producto || producto.stock <= 0) {
        throw new Error('Producto no disponible');
      }
      // 2. Obtener puntos del usuario
      const { rows: puntosRows } = await client.query(
        `SELECT COALESCE(SUM(cantidad), 0) AS total_puntos
        FROM puntos
        WHERE usuario_id = $1`,
       [usuario_id]
      );
      const totalPuntos = puntosRows[0].total_puntos;
  
      if (totalPuntos < producto.precio_puntos) {
        throw new Error('No tienes suficientes puntos');
      }
  
      // 3. Registrar la compra
      await client.query(
        `INSERT INTO compras (usuario_id, producto_id) VALUES ($1, $2)`,
        [usuario_id, producto_id]
      );
  
      // 4. Descontar puntos
      await client.query(
        `INSERT INTO puntos (usuario_id, cantidad) VALUES ($1, $2)`,
        [usuario_id, -producto.precio_puntos]
      );
  
      // 5. Reducir el stock
      await client.query(
        `UPDATE productos SET stock = stock - 1 WHERE id = $1`,
        [producto_id]
      );
  
      await client.query('COMMIT');
  
      res.json({ message: 'Compra exitosa' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error en la compra:', err);
      res.status(400).json({ message: err.message });
    }
  };
  
  exports.getComprasPorUsuario = async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const { rows } = await client.query(
      `SELECT 
         c.id AS compra_id,
         c.fecha,
         p.nombre AS producto_nombre,
         p.imagen_url,
         p.descripcion,
         p.precio_puntos
       FROM compras c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = $1
       ORDER BY c.fecha DESC`,
      [usuario_id]
    );

    res.json({ usuario_id, compras: rows });
  } catch (err) {
    console.error('Error al obtener compras del usuario:', err);
    res.status(500).json({ message: 'Error al obtener compras del usuario' });
  }
};
