const bcrypt = require('bcrypt');
const client = require('../config/db');
const jwt = require('jsonwebtoken');


const encriptarContraseña = async (contraseña) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(contraseña, salt);
        return hash;
    } catch (err) {
        console.error('Error al encriptar la contraseña:', err);
        throw err;
    }
};

const verificarContraseña = async (contraseñaIntroducida, contraseñaHash) => {
    try {
        return await bcrypt.compare(contraseñaIntroducida, contraseñaHash);
    } catch (err) {
        console.error('Error al verificar la contraseña:', err);
        throw err;
    }
};

const crearUsuario = async (req, res) => {
    const { nombre, email, contraseña, comunidad_id } = req.body;
    try {
        const contraseñaEncriptada = await encriptarContraseña(contraseña);
        const resultado = await client.query(
            'INSERT INTO usuarios (nombre, email, contraseña, comunidad_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, contraseñaEncriptada, comunidad_id]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error('Error al crear usuario:', err);
        res.status(500).send('Error al crear usuario');
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const resultado = await client.query('SELECT * FROM usuarios');
        res.json(resultado.rows);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).send('Error al obtener usuarios');
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await client.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.json(resultado.rows[0]);
    } catch (err) {
        console.error('Error al obtener el usuario:', err);
        res.status(500).send('Error al obtener el usuario');
    }
};

const login = async (req, res) => {
   const { email, contraseña } = req.body;
   try {
     const resultado = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (resultado.rows.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        const usuario = resultado.rows[0];
        const esValido = await verificarContraseña(contraseña, usuario.contraseña);
        if (!esValido) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            'Walking_33', 
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


const verificarUsuario = async (req, res) => {
    const { nombre, email } = req.body;

    try {
        const query = 'SELECT * FROM usuarios WHERE nombre = $1 OR email = $2';
        const { rowCount } = await client.query(query, [nombre, email]);

        if (rowCount > 0) {
            return res.status(400).json({ existe: true, mensaje: 'El nombre o email ya están en uso' });
        }

        res.status(200).json({ existe: false, mensaje: 'Nombre y email disponibles' });
    } catch (error) {
        console.error('Error verificando usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const obtenerUsuarioActual = async (req, res) => {
    const usuarioId = req.usuario.id;

    try {
        const resultadoUsuario = await client.query('SELECT id, nombre, email, comunidad_id, rol FROM usuarios WHERE id = $1', [usuarioId]);

        if (resultadoUsuario.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const usuario = resultadoUsuario.rows[0];
        console.log('Datos del usuario:', usuario);

        const resultadoComunidad = await client.query('SELECT nombre FROM comunidades WHERE id = $1', [usuario.comunidad_id]);

        if (resultadoComunidad.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Comunidad no encontrada' });
        }

        usuario.comunidad_nombre = resultadoComunidad.rows[0].nombre;

        res.status(200).json(usuario);
    } catch (err) {
        console.error('Error al obtener el usuario actual:', err);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};





// Exportar funciones
module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    login,
    verificarUsuario,
    obtenerUsuarioActual
};
