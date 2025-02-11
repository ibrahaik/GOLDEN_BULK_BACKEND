const bcrypt = require('bcrypt');
const client = require('../config/db');

// Encriptar la contraseña
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

// Verificar la contraseña
const verificarContraseña = async (contraseñaIntroducida, contraseñaHash) => {
    try {
        return await bcrypt.compare(contraseñaIntroducida, contraseñaHash);
    } catch (err) {
        console.error('Error al verificar la contraseña:', err);
        throw err;
    }
};

// Crear un nuevo usuario
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

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const resultado = await client.query('SELECT * FROM usuarios');
        res.json(resultado.rows);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).send('Error al obtener usuarios');
    }
};

// Obtener un usuario por ID
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

// Exportar funciones
module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId
};
