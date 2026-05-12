// ===============================
// notification.routes.js
// ===============================

import express from "express";

import {
  getNotificationsController,
  markAllNotificationReadController,
  markNotificationReadController
} from "../controllers/notification.controller";

import { protect } from "../middlewares/auth.middleware";

import validate from "../middlewares/validate.middleware";

import {
  updateNotificationSchema
} from "../validators/notification.validator";

const router = express.Router();

router.get(
  "/",
  protect,
  getNotificationsController
);

router.patch(
  "/read-all",
  protect,
  markAllNotificationReadController
);

router.patch(
  "/:notificationId/read",
  protect,
  validate(updateNotificationSchema),
  markNotificationReadController
);

export default router;