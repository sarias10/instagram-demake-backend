// Archivo principal de rutas
import { Router } from 'express';

import protectedRouter from './protected.routes';
import publicRouter from './public.routes';
import { tokenExtractor } from '../middlewares/middleware';

const router = Router();

// Importar rutas
router.use('/protected', tokenExtractor, protectedRouter);
router.use('/public', publicRouter);

export default router;