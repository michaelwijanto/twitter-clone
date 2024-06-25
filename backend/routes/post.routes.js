import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPost,
  getLikedPost,
  likeUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllPost);
router.get("/likes/:id", protectRoute, getLikedPost);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
