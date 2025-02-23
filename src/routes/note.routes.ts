import { Router } from 'express';
import { createNote, getAllNotes } from '../controllers/note.controller';

const router = Router();

router.get('/notes', getAllNotes);
router.post('/notes', createNote);

export default router;