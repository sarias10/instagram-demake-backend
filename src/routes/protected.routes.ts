import { Router } from 'express';
import { createPost, getAllPostsByUserId } from '../controllers/post.controller';
import { uploadMiddleware, uploadToS3 } from '../middlewares/upload';

const router = Router();

// Todas estas rutas estan protegidas, por tanto necesitan un token de acceso
router.get('/get-all-posts-by-user', getAllPostsByUserId);
router.post('/create-post', uploadMiddleware, uploadToS3, createPost);

export default router;