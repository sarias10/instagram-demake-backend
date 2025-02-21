// Configura Express
import express from 'express';
import cors from 'cors';
import router from './routes/index';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', router);

export default app;