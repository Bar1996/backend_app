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
 *           - imgUrl
 *           - name
 *           - userType
 *           properties:
 *               email:
 *                   type: string
 *                   description: The user email
 *               password:
 *                   type: string
 *                   description: The user password
 *               imgUrl:
 *                   type: string
 *                   description: The user profile image URL
 *               name:
 *                   type: string
 *                   description: The user name
 *               userType:
 *                   type: string
 *                   description: The type of user (e.g., local, google)
 *               tokens:
 *                   type: array
 *                   items:
 *                       type: string
 *                   description: The array of JWT tokens
 *           example:
 *               email: 'bob@gmail.com'
 *               password: '123456'
 *               imgUrl: 'http://example.com/img.jpg'
 *               name: 'Bob'
 *               userType: 'local'
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
 *      summary: Registers a new user
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
 *      summary: Logs in existing user by email and password
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                      required:
 *                          - email
 *                          - password
 *                      example:
 *                          email: 'bob@gmail.com'
 *                          password: '123456'
 *      responses:
 *          200:
 *              description: The access and refresh tokens
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Tokens'
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *  get:
 *      summary: Logs out the user
 *      tags: [Auth]
 *      description: Logs out the user by clearing their authentication tokens. The access token must be provided in the Authorization header.
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The user is logged out successfully
 *          401:
 *              description: Missing token
 *          403:
 *              description: Invalid token
 *          404:
 *              description: User not found
 *          400:
 *              description: Bad request
 */
router.get("/logout", authController.logout);


/**
 * @swagger
 * /auth/refresh:
 *  get:
 *      summary: Get new access token and refresh token using the refresh token
 *      tags: [Auth]
 *      description: Need to provide the refresh token in the auth header
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

/**
 * @swagger
 * /auth/getById:
 *  get:
 *      summary: Get user details by ID
 *      tags: [Auth]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The user details
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
router.get("/getById", authMiddleware, authController.getUserById);

/**
 * @swagger
 * /auth/update:
 *  put:
 *      summary: Update user details
 *      tags: [Auth]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          imgUrl:
 *                              type: string
 *                      required:
 *                          - name
 *                          - imgUrl
 *                      example:
 *                          name: 'Bob'
 *                          imgUrl: 'http://example.com/img.jpg'
 *      responses:
 *          200:
 *              description: The updated user details
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
router.put("/update", authMiddleware, authController.editUser);

/**
 * @swagger
 * /auth/updatePassword:
 *  put:
 *      summary: Change user password
 *      tags: [Auth]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          oldPassword:
 *                              type: string
 *                          newPassword:
 *                              type: string
 *                      required:
 *                          - oldPassword
 *                          - newPassword
 *                      example:
 *                          oldPassword: '123456'
 *                          newPassword: '654321'
 *      responses:
 *          200:
 *              description: Password changed successfully
 */
router.put("/updatePassword", authMiddleware, authController.changePassword);

/**
 * @swagger
 * /auth/posts:
 *  get:
 *      summary: Get user's posts
 *      tags: [Auth]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: List of user's posts
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  owner:
 *                                      type: string
 *                                  content:
 *                                      type: string
 *                              example:
 *                                  owner: 'userId'
 *                                  content: 'This is a post'
 */
router.get("/posts", authMiddleware, authController.getUserPosts);

/**
 * @swagger
 * /auth/check:
 *  get:
 *      summary: Check user authentication
 *      tags: [Auth]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Authentication successful
 */
router.get("/check", authMiddleware, authController.CheckAuth);

/**
 * @swagger
 * /auth/{id}:
 *  get:
 *      summary: Get user by ID
 *      tags: [Auth]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The user ID
 *      responses:
 *          200:
 *              description: The user details
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
router.get("/:id", authController.getUser);

export default router;
