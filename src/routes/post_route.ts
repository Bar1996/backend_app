import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";
// TODO add swagger documentation

router.get("/",authMiddleware, postController.get.bind(postController));

router.get("/:id",authMiddleware, postController.getById).bind(postController);

router.post("/post",authMiddleware, postController.post.bind(postController));

router.put("/:id",authMiddleware, postController.put.bind(postController));

router.delete("/:id",authMiddleware, postController.remove.bind(postController));



export default router;