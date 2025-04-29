const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Se espera que el token esté en la cabecera 'Authorization'

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, 'Walking_33');
        req.usuario = decoded;  // Decodificamos el token y lo añadimos al request
        next();  // Pasamos al siguiente middleware o controlador
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = verificarToken;
