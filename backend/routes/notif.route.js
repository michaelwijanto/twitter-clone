import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotification,
  deleteNotification,
  deleteOne,
} from "../controllers/notif.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotification);
router.delete("/", protectRoute, deleteNotification);
router.delete("/:id", protectRoute, deleteOne);

export default router;
