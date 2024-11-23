const express = require('express');
const router = express.Router();
const comment_controller = require('../controllers/comment_controller');

router.post('/', comment_controller.create_comment);
router.put('/', comment_controller.update_comment);

module.exports = router;
