const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const usuarioRoutes = require('./routes/usuarioRoutes');
const comunidadRoutes = require('./routes/comunidadRoutes');
const retoRoutes = require('./routes/retoRoutes');
const videoRoutes = require('./routes/videoRoutes');
const puntoRoutes = require('./routes/puntoRoutes');
const postRoutes = require('./routes/postsRoutes');
const likesRoutes = require('./routes/likesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const compraRoutes = require('./routes/compraRoutes')
const productosRoutes = require('./routes/productosRoutes');
const informacionRoutes = require('./routes/informacionRoutes');

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/comunidades', comunidadRoutes);
app.use('/retos', retoRoutes);
app.use('/videos', videoRoutes);
app.use('/puntos', puntoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/posts', postRoutes);
app.use('/likes', likesRoutes);
app.use('/comments', commentsRoutes);
app.use('/compra', compraRoutes);
app.use('/productos', productosRoutes);
app.use('/informacion', informacionRoutes);

app.get('/', (req, res) => {
  res.send('Api Ibrahim');
});

app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal');
});


server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
