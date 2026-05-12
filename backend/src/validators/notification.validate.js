// ===============================
// notification.validator.js
// ===============================

import { z } from "zod";

export const updateNotificationSchema = z.object({
  params: z.object({
    notificationId: z
      .string()
      .regex(/^\d+$/, "Notification ID must be number")
  })
});