// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Rutas
app.use('/api', chatRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(config.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
});