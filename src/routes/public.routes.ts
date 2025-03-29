import { Router } from 'express';
import { login } from '../controllers/login.controller';
import { createUser } from '../controllers/user.controller';

const router = Router();

router.get('/health-check', (_req, res) => {
    res.send('hola mundo');
});

router.post('/login', login);
router.post('/register', createUser);

export default router;