import { Router } from 'express';
import { login } from '../controllers/login.controller';
import { createUser } from '../controllers/user.controller';

const router = Router();

router.get('/health-check', (_req, res) => {
    res.status(200).send('hello world');
});

router.post('/login', login);
router.post('/register', createUser);

export default router;