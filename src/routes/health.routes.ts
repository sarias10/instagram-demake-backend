import { Router } from 'express';
import { healthCheckDatabase, healthChecService } from '../controllers/health.controller';

const router = Router();

router.get('/health-database', healthCheckDatabase);
router.get('/health-service', healthChecService);

export default router;