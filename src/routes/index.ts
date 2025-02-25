// Archivo principal de rutas
import { Router } from 'express';
import userRouter from './user.routes';
import noteRouter from './note.routes';
import likeRouter from './like.routes';
import commentRouter from './comment.routes';
import loginRouter from './login.routes';

import healthRouter from  './health.routes';

const router = Router();

// Ruta de ejemplo
router.get('/', (_req, res) => {
    res.send('Sergio les dice: HOLA MUNDO! 🌎 😂');
});

// Importar rutas
router.use(healthRouter);
router.use(userRouter);
router.use(noteRouter);
router.use(likeRouter);
router.use(commentRouter);
router.use(loginRouter);

export default router;