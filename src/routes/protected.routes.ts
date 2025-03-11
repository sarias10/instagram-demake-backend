import { Router } from 'express';
import { createPost, getAllPostsFromLoggedUser, getAllVisiblePosts, getAllVisblePostsFromUser } from '../controllers/post.controller';
import { uploadMiddleware, uploadToS3 } from '../middlewares/upload';
import { createComment } from '../controllers/comment.controller';

const router = Router();

// Todas estas rutas estan protegidas, por tanto necesitan un token de acceso
router.get('/get-all-posts-from-logged-user', getAllPostsFromLoggedUser);//
router.get('/get-all-visible-posts', getAllVisiblePosts);
router.get('/get-all-visible-posts-from-user', getAllVisblePostsFromUser);

router.post('/create-post', uploadMiddleware, uploadToS3, createPost);

router.post('/create-comment', createComment);
export default router;