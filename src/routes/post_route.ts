import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *       Post:
 *           type: object
 *           required:
 *           - text
 *           - owner
 *           - timestamp
 *           properties:
 *               text:
 *                   type: string
 *                   description: The content of the post
 *               owner:
 *                   type: string
 *                   description: The user ID of the post owner
 *               imgUrl:
 *                   type: string
 *                   description: The image URL of the post
 *               timestamp:
 *                   type: string
 *                   description: The timestamp of the post
 *           example:
 *               text: 'This is a post'
 *               owner: 'userId'
 *               imgUrl: 'http://example.com/img.jpg'
 *               timestamp: '2024-05-23T10:00:00Z'
 */

/**
 * @swagger
 * /post:
 *  get:
 *      summary: Retrieve a list of posts
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: A list of posts
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Post'
 */
router.get("/", authMiddleware, postController.get.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *  get:
 *      summary: Retrieve a post by ID
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The post ID
 *      responses:
 *          200:
 *              description: The post details
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Post'
 */
router.get("/:id", authMiddleware, postController.get.bind(postController));

/**
 * @swagger
 * /post/post:
 *  post:
 *      summary: Create a new post
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Post'
 *      responses:
 *          201:
 *              description: The created post
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Post'
 */
router.post("/post", authMiddleware, postController.post.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *  put:
 *      summary: Update a post by ID
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The post ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Post'
 *      responses:
 *          200:
 *              description: The updated post
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Post'
 */
router.put("/:id", authMiddleware, postController.put.bind(postController));

/**
 * @swagger
 * /post/{id}:
 *  delete:
 *      summary: Delete a post by ID
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The post ID
 *      responses:
 *          200:
 *              description: The post was deleted successfully
 */
router.delete("/:id", authMiddleware, postController.remove.bind(postController));

export default router;
