import { Router } from 'express';
import { createPost, deletePost, getAllPostsFromLoggedUser, getAllVisiblePosts, getAllVisiblePostsFromUser } from '../controllers/post.controller';
import { uploadMiddleware, uploadToS3 } from '../middlewares/upload';
import { createComment, getComments } from '../controllers/comment.controller';
import { createOrDeleteLike } from '../controllers/like.controller';
import { getAllUsers, getUserByUsername } from '../controllers/user.controller';

const router = Router();

// Todas estas rutas estan protegidas, por tanto necesitan un token de acceso
router.get('/get-all-posts-from-logged-user', getAllPostsFromLoggedUser);//

router.get('/get-all-visible-posts', getAllVisiblePosts);
router.get('/get-all-visible-posts-from-user/:username', getAllVisiblePostsFromUser);

router.delete('/deletePostById/:postId', deletePost);

router.get('/get-all-users', getAllUsers);
router.get('/get-user/:username', getUserByUsername);

router.post('/create-post', uploadMiddleware, uploadToS3, createPost);

router.post('/create-comment', createComment);
router.get('/get-comments-by-post-id/:postId', getComments);

router.post('/create-like',createOrDeleteLike);
export default router;