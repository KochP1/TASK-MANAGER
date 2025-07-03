const express = require('express');
const authRouter = require('./routers/authRouter');
const adminRouter = require('./routers/adminRouter');

const app = express();
app.use(express.json());

// Rutas públicas
app.use('/auth', authRouter);

// Ruta protegida
app.use('/admin', adminRouter);

app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});