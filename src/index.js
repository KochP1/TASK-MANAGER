const express = require('express');
const authRouter = require('./routers/authRouter');
const authenticate = require('./middleware/authMiddleware');

const app = express();
app.use(express.json()); // Para parsear JSON en las requests

// Rutas públicas
app.use('/auth', authRouter);

// Ruta protegida (ejemplo)

app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});