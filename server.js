const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

// Importar las rutas de cada recurso
const usuarioRoutes = require('./routes/usuarioRoutes');
const comunidadRoutes = require('./routes/comunidadRoutes');
const retoRoutes = require('./routes/retoRoutes');
const videoRoutes = require('./routes/videoRoutes');
const puntoRoutes = require('./routes/puntoRoutes');

// Middleware para analizar cuerpos de las solicitudes como JSON
app.use(bodyParser.json());

// Conexión a la base de datos (Asegúrate de tener el archivo de conexión con la base de datos configurado correctamente)
const client = require('./config/db');

// Usar las rutas
app.use('/comunidades', comunidadRoutes);
app.use('/retos', retoRoutes);
app.use('/videos', videoRoutes);
app.use('/puntos', puntoRoutes);
app.use('/usuarios', usuarioRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de FitPlus!');
});

// Manejar errores 404
app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada');
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

