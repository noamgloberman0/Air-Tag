import { Router } from 'express';
import { createComment, updateComment, getComments, deleteComment, getCommentsByPost } from '../controllers/commentController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - message
 *         - sender
 *         - post
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         message:
 *           type: string
 *           description: The message of the comment
 *         sender:
 *           type: string
 *           description: The sender of the comment
 *         post:
 *           type: string
 *           description: The post the comment belongs to
 *         date:
 *           type: string
 *           format: date
 *           description: The date the comment was created
 *       example:
 *         id: d5fE_asz
 *         message: This is a comment
 *         sender: User1
 *         post: Post1
 *         date: 2021-03-10T04:05:06.157Z
 *     CommentInput:
 *       type: object
 *       required:
 *         - message
 *         - sender
 *         - post
 *       properties:
 *         message:
 *           type: string
 *           description: The message of the comment
 *         sender:
 *           type: string
 *           description: The sender of the comment
 *         post:
 *           type: string
 *           description: The post the comment belongs to
 *         date:
 *           type: string
 *           format: date
 *           description: The date the comment was created
 *       example:
 *         message: This is a comment
 *         sender: User1
 *         post: Post1
 *         date: 2021-03-10T04:05:06.157Z
 *     CommentEdit:
 *       type: object
 *       required:
 *         - message
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         message:
 *           type: string
 *           description: The content of the comment
 *       example:
 *         id: d5fE_asz
 *         message: This is a comment
 */

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The comments managing API
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Some server error
 */
router.post('/', createComment);

/**
 * @swagger
 * /comment:
 *   put:
 *     summary: Update a comment by the id
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentEdit'
 *     responses:
 *       200:
 *         description: The comment was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: The comment was not found
 *       500:
 *         description: Some server error
 */
router.put('/', updateComment);

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id that needs to be deleted
 *     responses:
 *       200:
 *         description: The comment description by id
 *       404:
 *         description: The comment was not found
 *       500:
 *         description: Some server error
 */
router.delete('/:id', deleteComment);

/**
 * @swagger
 * /comment/post/{post}:
 *   get:
 *     summary: Get the comments by post id
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: post
 *         schema:
 *           type: string
 *         required: false
 *         description: The post id
 *     responses:
 *       200:
 *         description: The comment description by post id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: The comment was not found
 *       500:
 *         description: Some server error
 */
router.get('/post/:post', getCommentsByPost);

/**
 * @swagger
 * /comment/comments/{id}:
 *   get:
 *     summary: Get the comment by id
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: The comment id, if empty it will return all comments
 *     responses:
 *       200:
 *         description: The comment description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: The comment was not found
 *       500:
 *         description: Some server error
 */
router.get('/comments/:id?', getComments);

export default router;
