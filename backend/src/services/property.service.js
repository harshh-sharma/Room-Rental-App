import prisma from "../config/db.js";
import AppError from "../utils/AppError.js";

export const createPropertyService = async ({
  ownerId,
  propertyName,
  state,
  city,
  pincode,
  address,
}) => {
  const owner = await prisma.user.findUnique({
    where: {
      id: ownerId,
    },
  });

  const isPropertyAddressAlreadyExist = await prisma.property.findFirst({
    where: {
      propertyName,
      state,
      city,
      address,
      pincode,
      ownerId,
    },
  });

  if (isPropertyAddressAlreadyExist) {
    throw new AppError("Property already exist with name & address", 400);
  }

  const property = await prisma.property.create({
    data: {
      state,
      city,
      pincode,
      address,
      ownerId,
    },
  });

  return property;
};

export const getAllPropertiesService = async ({ ownerId }) => {
  const properties = await prisma.property.findMany({
    where: { ownerId },
  });

  return properties;
};

export const getPublicPropertiesService = async ({ page, limit }) => {
  const properties = await prisma.property.findMany({
    where: {
      isPublic: true,
    },
    skip,
    take: limit,
    select: {
      id: true,
      propertyName: true,
      city: true,
      state: true,
      address: true,
      pincode: true,
      latitude: true,
      longitude: true,
      createdAt: true,
    },
  });

  return properties;
};

export const updatePropertyService = async ({
  ownerId,
  porpertyId,
  updateData,
}) => {
  if (Object.keys(updateData).length === 0) {
    throw new AppError("No data provided to update", 400);
  }

  const property = await prisma.property.findUnique({
    where: { propertyId },
  });

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.ownerId !== ownerId) {
    throw new AppError("You are not allowed to update this property", 403);
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: {
      updateData,
    },
  });

  return updatedProperty;
};

export const deletePropertyService = async ({ ownerId, propertyId }) => {
  const property = await prisma.property.findUnique({
    where: { id: Number(propertyId) },
  });

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (ownerId !== property.ownerId) {
    throw new AppError("You are not allowed to this property", 403);
  }

  const deletedProperty = await prisma.property.delete({
    where: { id: propertyId },
  });

  return deletedProperty;
};

export const getSinglePropertyService = async ({ userId, propertyId }) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new AppError("property not found", 404);
  }

 if (!property.isPublic && property.ownerId !== userId) {
  throw new AppError("You are not allowed to view this property", 403);
}

  return property;
};
