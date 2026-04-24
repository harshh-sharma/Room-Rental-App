import prisma from "../config/db.js";
import AppError from "../utils/AppError.js";

export const createAgreementService = async ({
  ownerId,
  propertyId,
  roomId,
  renterId,
  rent,
  startDate,
  endDate,
  deposit = 0,

  electricityRate,
  dueDay,
  fixedCharges,
}) => {

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { property: true },
  });

  if (!room) {
    throw new AppError("Room not found", 404);
  }

  if (room.property.id !== propertyId) {
    throw new AppError("Room does not belong to this property", 400);
  }

  if (room.property.ownerId !== ownerId) {
    throw new AppError("Not authorized to create agreement", 403);
  }

  const activeCount = await prisma.agreement.count({
    where: {
      roomId,
      isActive: true,
    },
  });

  if (room.roomType === "Single" && activeCount >= 1) {
    throw new AppError("Room already occupied", 400);
  }

  if (room.roomType === "PG" && activeCount >= room.capacity) {
    throw new AppError("Room is full", 400);
  }

  const renter = await prisma.user.findUnique({
    where: { id: renterId },
  });

  if (!renter) {
    throw new AppError("Renter not found", 404);
  }

  if (renter.role !== "RENTER") {
    throw new AppError("User is not a renter", 400);
  }

  const existingRenterAgreement = await prisma.agreement.findFirst({
    where: {
      renterId,
      isActive: true,
    },
  });

  if (existingRenterAgreement) {
    throw new AppError("Renter already has an active agreement", 400);
  }

  if (rent <= 0) {
    throw new AppError("Rent must be greater than 0", 400);
  }

 if (electricityRate !== undefined && electricityRate < 0) {
  throw new AppError("Electricity rate cannot be negative", 400);
}

if (fixedCharges && typeof fixedCharges !== "object") {
  throw new AppError("fixedCharges must be an object", 400);
}


if (fixedCharges) {
  for (const key in fixedCharges) {
    if (typeof fixedCharges[key] !== "number") {
      throw new AppError("All fixed charges must be numbers", 400);
    }
  }
}

  if (!dueDay || dueDay < 1 || dueDay > 28) {
  throw new AppError("Due day must be between 1–28 (safe for all months)", 400);
}

  const start = new Date(startDate);

  if (start < new Date()) {
    throw new AppError("Start date cannot be in the past", 400);
  }

  if (endDate) {
    const end = new Date(endDate);

    if (start >= end) {
      throw new AppError("End date must be after start date", 400);
    }
  }

  const agreement = await prisma.agreement.create({
    data: {
      ownerId,
      propertyId,
      roomId,
      renterId,
      rent,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      deposit,
      dueDay,
      electricityRate,
      fixedCharges,
      isActive: true,
    },
  });

  return agreement;
};

// TODO: Settlement logic (deposit + pending dues)
export const endAgreementService = async ({
  ownerId,
  agreementId,
  propertyId,
  roomId,
}) => {

  const agreement = await prisma.agreement.findUnique({
    where: { id: agreementId },
    include: {
      room: true,
      property: true,
    },
  });

  if (!agreement) {
    throw new AppError("Agreement not found", 404);
  }

  if (agreement.property.ownerId !== ownerId) {
    throw new AppError("Not authorized to end this agreement", 403);
  }

  if (agreement.propertyId !== propertyId) {
    throw new AppError("Agreement does not belong to this property", 400);
  }

  if (agreement.roomId !== roomId) {
    throw new AppError("Agreement does not belong to this room", 400);
  }

  if (!agreement.isActive) {
    throw new AppError("Agreement already ended", 400);
  }

  const updatedAgreement = await prisma.agreement.update({
    where: { id: agreementId },
    data: {
      isActive: false,
      endDate: new Date(), 
    },
  });

  return updatedAgreement;
};

export const getRenterAgreementsService = async ({ renterId }) => {

  const agreements = await prisma.agreement.findMany({
    where: { renterId },
    include: {
      property: {
        select: {
          id: true,
          propertyName: true,
          city: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          roomType: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return agreements;
};

export const getOwnerAgreementsService = async ({ ownerId }) => {

  const agreements = await prisma.agreement.findMany({
    where: { ownerId },
    include: {
      property: {
        select: {
          id: true,
          propertyName: true,
          city: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          roomType: true,
        },
      },
      renter: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return agreements;
};

export const getSingleAgreementService = async ({
  agreementId,
  userId,
}) => {

  const agreement = await prisma.agreement.findUnique({
    where: { id: agreementId },
    include: {
      property: {
        select: {
          id: true,
          propertyName: true,
          address: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          roomType: true,
          capacity: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
      renter: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!agreement) {
    throw new AppError("Agreement not found", 404);
  }

  // 🔐 AUTH CHECK
  if (
    agreement.ownerId !== userId &&
    agreement.renterId !== userId
  ) {
    throw new AppError("Not authorized", 403);
  }

  return agreement;
};