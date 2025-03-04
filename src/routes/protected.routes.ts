import { Router } from 'express';
import { createNote, getAllNotesByUserId } from '../controllers/note.controller';

const router = Router();

// Todas estas rutas estan protegidas, por tanto necesitan un token de acceso
router.get('/get-all-notes-by-user', getAllNotesByUserId);
router.post('/create-note', createNote);

export default router;