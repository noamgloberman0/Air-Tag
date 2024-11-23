const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');

router.post('/', postController.add_post);
router.get('/', postController.get_all_posts);
router.get('/:post_id', postController.get_post_by_id);
router.get('/', postController.get_posts_by_sender);
router.put('/:post_id', postController.update_post);

module.exports = router;
