import { z } from "zod";

/**
 * CREATE ROOM VALIDATION
 */
export const createRoomSchema = z.object({
  roomNumber: z
    .string({ required_error: "Room number is required" })
    .min(1, "Room number cannot be empty")
    .max(10, "Room number too long"),

  roomType: z.enum(["PG", "Single"], {
    required_error: "Room type is required",
  }),

  capacity: z.coerce
    .number({ required_error: "Capacity is required" })
    .int("Capacity must be an integer")
    .min(1, "Capacity must be at least 1"),
});

/**
 * UPDATE ROOM VALIDATION
 */
export const updateRoomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, "Room number cannot be empty")
    .max(10, "Room number too long")
    .optional(),

  roomType: z.enum(["PG", "Single"]).optional(),

  capacity: z.coerce
    .number()
    .int("Capacity must be an integer")
    .min(1, "Capacity must be at least 1")
    .optional(),
});