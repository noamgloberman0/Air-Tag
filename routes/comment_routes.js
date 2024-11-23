const express = require('express');
const router = express.Router();
const comment_controller = require('../controllers/comment_controller');

router.post('/', comment_controller.create_comment);
router.put('/', comment_controller.update_comment);
router.get('/:id?', comment_controller.get_comments);
router.delete('/:id', comment_controller.delete_comment);
router.get('/post/:post', comment_controller.get_comments_by_post);

module.exports = router;
