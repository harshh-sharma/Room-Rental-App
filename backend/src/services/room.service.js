import prisma from "../config/db.js";
import AppError from "../utils/AppError.js";

export const createRoomService = async ({
  ownerId,
  propertyId,
  roomNumber,
  roomType,
  capacity = 1,
}) => {
  roomNumber = roomNumber.trim();

  if (capacity < 1) {
    throw new AppError("Capacity must be at least 1", 400);
  }

  if (roomType === "Single" && capacity !== 1) {
    throw new AppError("Single room must have capacity 1", 400);
  }

  if (roomType === "PG" && capacity < 2) {
    throw new AppError("PG room must have capacity at least 2", 400);
  }
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.ownerId !== ownerId) {
    throw new AppError("You are not allowed to add room to this property", 403);
  }

  const existingRoom = await prisma.room.findFirst({
    where: {
      propertyId,
      roomNumber,
    },
  });

  if (existingRoom) {
    throw new AppError("Room number already exists in this property", 400);
  }

  const room = await prisma.room.create({
    data: {
      propertyId,
      roomNumber,
      roomType,
      capacity,
    },
  });

  return room;
};

export const getAllRoomsService = async ({
    ownerId,
    propertyId
}) => {
    const property = await prisma.property.findFirst({
        where:{id:propertyId, ownerId}
    });

    if(!property){
        throw new AppError("Property not found", 404);
    }

    const rooms = await prisma.room.findMany({
        where:{propertyId},
        orderBy: { id: "desc" },
    });

    return rooms;
}

export const getSingleRoomService = async (ownerId,propertyId,roomId) => {
    const room = await prisma.room.findUnique({
        where:{id: roomId},
        include:{
            property: true
        }
    });

    if(!room){
        throw new AppError("Room not found", 404);
    }

    if(room.propertyId !== propertyId){
        throw new AppError("Room not belongs to this property", 403);
    }

    if(roomId.property.ownerId !== ownerId){
        throw new AppError("You are not allowed to view this room", 404)
    }

    return room;
}


export const deleteRoomService = async (ownerId,roomId) => {
    const room = await prisma.room.findUnique({
        where:{id:roomId},
        include:{
            property: true
        }
    });

    if(!room){
        throw new AppError("Room not found", 404);
    }

    if(room.property.ownerId !== ownerId){
        throw new AppError("You are not allowed to delete this room", 403);
    }

   const deletedRoom  = await prisma.room.delete({
    where:{id:roomId}
   })

   return deletedRoom ;
}


export const updateRoomService = async ({
  ownerId,
  roomId,
  updateData,
}) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      property: true,
    },
  });

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.property.ownerId !== ownerId) {
    throw new AppError("You are not allowed to update this room", 403);
  }

  if (updateData.roomNumber) {
    updateData.roomNumber = updateData.roomNumber.trim();

    const existingRoom = await prisma.room.findFirst({
      where: {
        propertyId: room.propertyId,
        roomNumber: updateData.roomNumber,
        NOT: { id: roomId }, // ignore current room
      },
    });

    if (existingRoom) {
      throw new AppError(
        "Room number already exists in this property",
        400
      );
    }
  }

  const roomType = updateData.roomType || room.roomType;
  const capacity = updateData.capacity ?? room.capacity;

  if (capacity < 1) {
    throw new AppError("Capacity must be at least 1", 400);
  }

  if (roomType === "Single" && capacity !== 1) {
    throw new AppError("Single room must have capacity 1", 400);
  }

  if (roomType === "PG" && capacity < 2) {
    throw new AppError("PG room must have capacity at least 2", 400);
  }
  const updatedRoom = await prisma.room.update({
    where: { id: roomId },
    data: updateData,
  });

  return updatedRoom;
};