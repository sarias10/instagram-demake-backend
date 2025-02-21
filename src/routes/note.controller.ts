import { Router } from 'express';
import { createNote } from '../controllers/note.controller';

const router = Router();

router.post('/notes', createNote);

export default router;