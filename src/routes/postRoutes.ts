import { Router } from 'express';
import { addPost, getAllPosts, getPostById, getPostsBySender, updatePost } from '../controllers/postController';

const router = Router();

router.post('/', addPost);
router.get('/', getAllPosts);
router.get('/:post_id', getPostById);
router.get('/', getPostsBySender);
router.put('/:post_id', updatePost);

export default router;
