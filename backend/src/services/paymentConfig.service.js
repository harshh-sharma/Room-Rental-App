import prisma from "../config/db";
import AppError from "../utils/AppError";

export const createPaymentConfigService = async ({
  ownerId,
  razorpayEnabled,
  mode,
  testKeyId,
  testKeySecret,
  liveKeyId,
  liveKeySecret
}) => {

  const existing = await prisma.paymentConfig.findUnique({
    where: { ownerId }
  });

  if (existing) {
    throw new AppError(
      "Payment config already exists",
      400
    );
  }

  const owner = await prisma.user.findUnique({
    where: { id: ownerId }
  });

  if (!owner) {
    throw new AppError("Owner not found", 404);
  }

  if (owner.role !== "OWNER") {
    throw new AppError("Not authorized", 403);
  }

  if (razorpayEnabled) {

    if (mode === "TEST") {

      if (!testKeyId || !testKeySecret) {
        throw new AppError(
          "Test Razorpay keys required",
          400
        );
      }

    }

    if (mode === "LIVE") {

      if (!liveKeyId || !liveKeySecret) {
        throw new AppError(
          "Live Razorpay keys required",
          400
        );
      }

    }
  }

  const config = await prisma.paymentConfig.create({
    data: {
      ownerId,
      razorpayEnabled,
      mode,
      testKeyId,
      testKeySecret,
      liveKeyId,
      liveKeySecret
    }
  });

  return {
    id: config.id,
    razorpayEnabled: config.razorpayEnabled,
    mode: config.mode,
    testKeyId: config.testKeyId,
    liveKeyId: config.liveKeyId
  };
};


export const updatePaymentConfigService = async ({
  paymentConfigId,
  updateData
}) => {

  const paymentConfig =
    await prisma.paymentConfig.findUnique({
      where: { id: paymentConfigId }
    });

  if (!paymentConfig) {
    throw new AppError(
      "No payment config found",
      404
    );
  }

  // 🔥 merge old + new
  const mergedData = {
    ...paymentConfig,
    ...updateData
  };

  // 🔥 validation
  if (mergedData.razorpayEnabled) {

    if (mergedData.mode === "TEST") {

      if (
        !mergedData.testKeyId ||
        !mergedData.testKeySecret
      ) {
        throw new AppError(
          "Test Razorpay keys required",
          400
        );
      }

    }

    if (mergedData.mode === "LIVE") {

      if (
        !mergedData.liveKeyId ||
        !mergedData.liveKeySecret
      ) {
        throw new AppError(
          "Live Razorpay keys required",
          400
        );
      }

    }
  }

  const config = await prisma.paymentConfig.update({
    where: {
      id: paymentConfigId
    },
    data: {
      ...updateData
    }
  });

  return {
    id: config.id,
    razorpayEnabled: config.razorpayEnabled,
    mode: config.mode,
    testKeyId: config.testKeyId,
    liveKeyId: config.liveKeyId
  };
};

export const getPaymentConfigService = async ({
  ownerId
}) => {

  const config = await prisma.paymentConfig.findUnique({
    where: {
      ownerId
    }
  });

  if (!config) {
    throw new AppError(
      "Payment config not found",
      404
    );
  }

  return {
    id: config.id,
    razorpayEnabled: config.razorpayEnabled,
    mode: config.mode,
    testKeyId: config.testKeyId,
    liveKeyId: config.liveKeyId
  };
};
