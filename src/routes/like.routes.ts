import { Router } from 'express';
import { createDeleteLike, getAllLikes } from '../controllers/like.controller';

const router = Router();

router.get('/likes', getAllLikes);
router.post('/likes', createDeleteLike);

export default router;