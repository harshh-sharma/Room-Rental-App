import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
} from "../controllers/room.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createRoomSchema,
  updateRoomSchema,
} from "../validators/room.validate.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Room
 *   description: Room management APIs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// =========================
// CREATE ROOM
// =========================
/**
 * @swagger
 * /api/rooms/{propertyId}:
 *   post:
 *     summary: Create a room inside a property
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roomNumber, roomType, capacity]
 *             properties:
 *               roomNumber:
 *                 type: string
 *                 example: "101"
 *               roomType:
 *                 type: string
 *                 enum: [PG, Single]
 *               capacity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Room created successfully
 */
router.post(
  "/:propertyId",
  protect,
  authorize("OWNER"),
  validate(createRoomSchema),
  createRoom
);

// =========================
// GET ALL ROOMS
// =========================
/**
 * @swagger
 * /api/rooms/{propertyId}:
 *   get:
 *     summary: Get all rooms of a property
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rooms fetched successfully
 */
router.get(
  "/:propertyId",
  protect,
  authorize("OWNER"),
  getAllRooms
);

// =========================
// GET SINGLE ROOM
// =========================
/**
 * @swagger
 * /api/rooms/{propertyId}/{roomId}:
 *   get:
 *     summary: Get single room
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room fetched successfully
 */
router.get(
  "/:propertyId/:roomId",
  protect,
  authorize("OWNER"),
  getSingleRoom
);

// =========================
// UPDATE ROOM
// =========================
/**
 * @swagger
 * /api/rooms/{roomId}:
 *   put:
 *     summary: Update room details
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               roomNumber: "102"
 *               capacity: 3
 *     responses:
 *       200:
 *         description: Room updated successfully
 */
router.put(
  "/:roomId",
  protect,
  authorize("OWNER"),
  validate(updateRoomSchema),
  updateRoom
);

// =========================
// DELETE ROOM
// =========================
/**
 * @swagger
 * /api/rooms/{roomId}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room deleted successfully
 */
router.delete(
  "/:roomId",
  protect,
  authorize("OWNER"),
  deleteRoom
);

export default router;