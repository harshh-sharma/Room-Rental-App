import prisma from "../config/db"
import AppError from "../utils/AppError";

import prisma from "../config/db";
import AppError from "../utils/AppError.js";

export const addMeterReadingService = async ({
  userId,
  agreementId,
  units,
  imageUrl
}) => {

  const agreement = await prisma.agreement.findUnique({
    where: { id: agreementId }
  });

  if (!agreement) throw new AppError("Agreement not found", 404);

  if (agreement.renterId !== userId) {
    throw new AppError("Not authorized", 403);
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const existing = await prisma.MeterReading.findFirst({
    where: {
      agreementId,
      createdAt: { gte: start, lte: end }
    }
  });

if (existing) {
  if(existing.usedInBill){
    throw new AppError("Bill already generated", 400)
  }

  if (existing.status === "APPROVED") {
    throw new AppError("Reading already approved for this month", 400);
  }

  if (existing.status === "PENDING") {
    throw new AppError("Reading already submitted and pending approval", 400);
  }

  if (existing.status === "REJECTED") {
    return await prisma.MeterReading.update({
      where: { id: existing.id },
      data: {
        units,
        imageUrl,
        status: "PENDING",
        rejectionNote: null,
        usedInBill: false
      }
    });
  }
}

  const reading = await prisma.MeterReading.create({
    data: {
      agreementId,
      units,
      imageUrl,
      status: "PENDING"
    }
  });

  return reading;
};


export const updateReadingStatusService = async ({
  userId,
  readingId,
  status,
  rejectionNote
}) => {

  const reading = await prisma.MeterReading.findUnique({
    where: { id: readingId },
    include: { agreement: true }
  });

  if (!reading) {
    throw new AppError("Reading not found", 404);
  }

  if (reading.agreement.ownerId !== userId) {
    throw new AppError("Not authorized", 403);
  }

 if (reading.usedInBill) {
  throw new AppError("Cannot update reading after bill generation", 400);
}

  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  if (status === "REJECTED" && !rejectionNote) {
    throw new AppError("Rejection reason required", 400);
  }

  const updated = await prisma.MeterReading.update({
    where: { id: readingId },
    data: {
      status,
      rejectionNote: status === "REJECTED" ? rejectionNote : null
    }
  });

  return updated;
};

export const getAllPendingBillRelatedToProperty = async ({
  propertyId,
  userId
}) => {

  const readings = await prisma.MeterReading.findMany({
    where: {
      status: "PENDING",
      agreement: {
        propertyId: Number(propertyId),
        ownerId: Number(userId)
      }
    },
    include: {
      agreement: {
        include: {
          renter: {
            select: {
              id: true,
              name: true
            }
          },
          room: true,
          property: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });


  return readings;
};

export const getAllReadingForRenterService = async ({
  userId,
  filters
}) => {
  const readings = await prisma.MeterReading.findMany({
    where:{
      ...filters,
      agreement:{
        renterId:userId
      },
      include: {
      agreement: {
        include: {
          room: true,
          property: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
    }
  })


  return readings;
}


export const getSingleReadingService = async ({
  readingId,
  userId
}) => {
  const reading = await prisma.MeterReading.findUnique({
    where:{id:readingId},
    include:{
      agreement:{
        include:{
          property: true,
          room: true,
          owner: true,
          renter: true
        }
      }
    }
  });

  if (!reading) {
  throw new AppError("Reading not found", 404);
}

 if (
  userId !== reading.agreement.ownerId &&
  userId !== reading.agreement.renterId
) {
  throw new AppError("You are not authorized to view this reading", 403);
}

  return reading;

}