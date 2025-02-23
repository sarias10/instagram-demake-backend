import { Router } from 'express';
import { createComment, getAllComments } from '../controllers/comment.controller';

const router = Router();

router.get('/comments', getAllComments);
router.post('/comments', createComment);

export default router;