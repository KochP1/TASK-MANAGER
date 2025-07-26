const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/authRouter');
const adminRouter = require('./routers/adminRouter');
const userRouter = require('./routers/userRouter');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.SERVER_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


// Rutas públicas
app.use('/auth', authRouter);

// Ruta protegida
app.use('/admin', adminRouter);
app.use('/user', userRouter)

app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});