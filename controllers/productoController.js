const client = require('../config/db');

exports.obtenerProductos = async (req, res) => {
  try {
    const resultado = await client.query('SELECT * FROM productos');
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.crearProducto = async (req, res) => {
  const { nombre, descripcion, precio_puntos, stock, imagen_url } = req.body;
  
  try {
    const resultado = await client.query(
      'INSERT INTO productos (nombre, descripcion, precio_puntos, stock, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, precio_puntos, stock, imagen_url]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

exports.actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio_puntos, stock } = req.body;
  
  try {
    const resultado = await client.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio_puntos = $3, stock = $4 WHERE id = $5 RETURNING *',
      [nombre, descripcion, precio_puntos, stock, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await client.query('SELECT * FROM productos WHERE id = $1', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};
