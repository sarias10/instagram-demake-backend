// Archivo principal de rutas
import { Router } from 'express';

import protectedRouter from './protected.routes';
import publicRouter from './public.routes';
import { tokenExtractor } from '../middlewares/middleware';

const router = Router();

// Ruta de ejemplo
router.get('/', (_req, res) => {
    res.send('Sergio les dice: HOLA MUNDO! 🌎 😂');
});

// Importar rutas
router.use('/protected', tokenExtractor, protectedRouter);
router.use('/public', publicRouter);

export default router;