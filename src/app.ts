// Configura Express
import express from 'express';
import cors from 'cors';
import router from './routes/index';
import { errorHandler, requestLogger, unknownEndpoint } from './middlewares/middleware';
// Creamos una nueva instancia de una aplicación Express. `app` es un objeto que tiene métodos para rutas y middleware, entre otras cosas.
const app = express();

// Middlewares

// Este middleware analiza los cuerpos de las solicitudes entrantes en un formato JSON, lo que significa que podemos acceder al cuerpo de la solicitud como un objeto JavaScript en nuestros controladores de rutas.
app.use(express.json());

app.use(requestLogger);

// Este middleware por defecto permite solicitudes de todos los orígenes
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [ 'https://instagram-demake.sarias.uk' ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: [ 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' ],
    allowedHeaders: [ 'Content-Type', 'Authorization' ],
    credentials: true
}));

// Rutas
app.use('/api', router);

// Maneja las solicitudes con endpoints desconocidos
app.use(unknownEndpoint);
// Maneja todos los errores, por eso se ejecuta de último
app.use(errorHandler);

export default app;