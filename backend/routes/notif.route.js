import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotification,
  deleteNotification,
} from "../controllers/notif.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotification);
router.delete("/", protectRoute, deleteNotification);

export default router;
