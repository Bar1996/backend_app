import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *       bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *       User:
 *           type: object
 *           required:
 *           - email
 *           - password
 *           properties:
 *               email:
 *                   type: string
 *                   description: The user email
 *               password:
 *                   type: string
 *                   description: The user password
 *           example:
 *               email: 'bob@gmail.com'
 *               password: '123456'
 *       Tokens:
 *          type: object
 *          required:
 *              - accessToken
 *              - refreshToken
 *          properties:
 *              accessToken:
 *                  type: string
 *                  description: The JWT access token
 *              refreshToken:
 *                  type: string
 *                  description: The JWT refresh token
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary: registers a new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: The new user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
router.post("/register", authController.register);
router.post("/google", authController.googleSignIn);

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: logs in existing user by emqail and password
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: The access and refresh tokens
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *  get:
 *      summary: logs out the user
 *      tags: [Auth]
 *      description: need to provide the refresh token in the auth header
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The user is logged out successfully
 */
router.get("/logout", authController.logout);

/**
* @swagger
* /auth/refresh:
 *  get:
 *      summary: get new access token and refresh token using the refresh token
 *      tags: [Auth]
 *      description: need to provide the refresh token in the auth header
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The new access token and refresh token
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tokens'
 */
router.get("/refresh", authController.refresh);

router.get("/getById",authMiddleware, authController.getUserById);

router.put("/update",authMiddleware, authController.editUser);

router.put("/updatePassword",authMiddleware, authController.changePassword);

router.get("/posts", authMiddleware, authController.getUserPosts);

router.get("/check", authMiddleware, authController.CheckAuth);

router.get("/:id", authController.getUser);







export default router;
