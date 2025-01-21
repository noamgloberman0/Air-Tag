import { Router } from 'express';
import { addPost, getAllPosts, getPostById, getPostsBySender, updatePost } from '../controllers/postController';

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - message
 *         - sender
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         message:
 *           type: string
 *           description: The content of the post
 *         likes:
 *           type: number
 *           description: The amount of likes the post has
 *       example:
 *         id: d5fE_asz
 *         message: This is the content of the post
 *         sender: User1
 *         likes: 12
 *     PostInput:
 *       type: object
 *       required:
 *         - message
 *         - sender
 *       properties:
 *         message:
 *           type: string
 *           description: The content of the post
 *         likes:
 *           type: integer
 *           description: The amount of likes the post has
 *       example:
 *         message: This is the content of the post
 *         sender: User1
 *         likes: 12
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The posts managing API
 */

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */
router.post('/', addPost);

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */
router.get('/', getAllPosts);

/**
 * @swagger
 * /post/id/{post_id}:
 *   get:
 *     summary: Get the post by id
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The post description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Some server error
 */
router.get('/id/:post_id', getPostById);

/**
 * @swagger
 * /post/sender:
 *   get:
 *     summary: Get all posts by sender
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *         required: true
 *         description: The sender id
 *     responses:
 *       200:
 *         description: The list of the posts by sender
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */
router.get('/sender', getPostsBySender);

/**
 * @swagger
 * /post/{post_id}:
 *   put:
 *     summary: Update a post by the id
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: The post was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Some server error
 */
router.put('/:post_id', updatePost);

export default router;

