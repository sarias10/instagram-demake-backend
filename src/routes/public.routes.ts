import { Router } from 'express';
import { getAllPublicNotes } from '../controllers/note.controller';
import { login } from '../controllers/login.controller';
import { createUser } from '../controllers/user.controller';

const router = Router();

router.post('/login', login);
router.post('/register', createUser);

router.get('/visible-notes', getAllPublicNotes);

export default router;