// Archivo principal de rutas
import { Router } from 'express';
import userRouter from './user.controller';
import noteRouter from './note.controller';

const router = Router();

// Ruta de ejemplo
router.get('/', (_req, res) => {
    res.send('Sergio les dice: HOLA MUNDO! 🌎 😂');
});

// Importar rutas
// router.use(healthRoutes);
router.use(userRouter);
router.use(noteRouter);

export default router;