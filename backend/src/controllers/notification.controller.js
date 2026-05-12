// ===============================
// notification.controller.js
// ===============================

import {
  getAllNotification,
  getAllNotificationService,
  updateAllNotificationService,
  updateNotificationService
} from "../services/notification.service";
import asyncHandler from "../utils/asyncHandler";

export const getNotifications =
  asyncHandler(async (req, res) => {

    const notifications =
      await getAllNotificationService({
        userId: req.user.id
      });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: notifications
    });
  });

export const markNotificationRead =
  asyncHandler(async (req, res) => {

    const notification =
      await updateNotificationService({
        notificationId: Number(
          req.params.notificationId
        ),
        userId: req.user.id
      });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });
  });

export const markAllNotificationRead =
  asyncHandler(async (req, res) => {

    await updateAllNotificationService({
      userId: req.user.id
    });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  });