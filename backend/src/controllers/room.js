import {
  createRoomService,
  deleteRoomService,
  getAllRoomsService,
  getSingleRoomService,
  updateRoomService,
} from "../services/room.service.js";

import asyncHandler from "../utils/asyncHandler.js";

export const createRoom = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { propertyId } = req.params;
  const { roomNumber, roomType, capacity } = req.body;

  const room = await createRoomService({
    ownerId: id,
    propertyId: Number(propertyId),
    roomNumber,
    roomType,
    capacity,
  });

  return res.status(201).json({
    success: true,
    message: "Successfully room created",
    data: room,
  });
});

export const getAllRooms = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { propertyId } = req.params;

  const rooms = await getAllRoomsService({
    ownerId: id,
    propertyId: Number(propertyId),
  });

  return res.status(200).json({
    success: true,
    message: "Successfully get all rooms",
    data: rooms,
  });
});

export const getSingleRoom = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { propertyId, roomId } = req.params;

  const room = await getSingleRoomService({
    ownerId: id,
    propertyId: Number(propertyId),
    roomId: Number(roomId),
  });

  return res.status(200).json({
    success: true,
    message: "Successfully get room",
    data: room,
  });
});

export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { roomId } = req.params;

  const room = await deleteRoomService({
    ownerId: id,
    roomId: Number(roomId),
  });

  return res.status(200).json({
    success: true,
    message: "Successfully room deleted",
    data: room,
  });
});

export const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { roomId } = req.params;

  const room = await updateRoomService({
    ownerId: id,
    roomId: Number(roomId),
    updateData: req.body,
  });

  return res.status(200).json({
    success: true,
    message: "Room successfully updated",
    data: room,
  });
});