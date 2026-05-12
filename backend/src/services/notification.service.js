import prisma from "../config/db";
import AppError from "../utils/AppError";

export const createNotificationService = async ({
  receiverId,
  title,
  description,
  notificationType
}) => {

  const notification = await prisma.notification.create({
    data: {
      receiverId,
      title,
      description,
      type: notificationType
    }
  });

  return notification;
};

export const updateNotificationService = async ({
  notificationId,
  userId
}) => {

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (notification.receiverId !== userId) {
    throw new AppError("Not authorized", 403);
  }

  const updatedNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true
    }
  });

  return updatedNotification;
};

export const updateAllNotificationService = async ({
  userId
}) => {

  await prisma.notification.updateMany({
    where: {
      receiverId: userId,
      isRead: false
    },
    data: {
      isRead: true
    }
  });

  return true;
};

export const getAllNotificationService = async ({
  userId
}) => {

  const notifications = await prisma.notification.findMany({
    where: {
      receiverId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return notifications;
};