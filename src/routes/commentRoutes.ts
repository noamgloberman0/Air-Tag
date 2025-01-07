import { Router } from 'express';
import { createComment, updateComment, getComments, deleteComment, getCommentsByPost } from '../controllers/commentController';

const router = Router();

router.post('/', createComment);
router.put('/', updateComment);
router.get('/:id?', getComments);
router.delete('/:id', deleteComment);
router.get('/post/:post', getCommentsByPost);

export default router;
