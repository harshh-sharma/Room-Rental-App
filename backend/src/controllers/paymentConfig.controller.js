// controllers/paymentConfig.controller.js

import asyncHandler from "../utils/asyncHandler.js";

import {
  createPaymentConfigService,
  updatePaymentConfigService,
  getPaymentConfigService
} from "../services/paymentConfig.service.js";

export const createPaymentConfig = asyncHandler(
  async (req, res) => {

    const config =
      await createPaymentConfigService({
        ownerId: req.user.id,
        ...req.body
      });

    return res.status(201).json({
      success: true,
      message: "Payment config created successfully",
      data: config
    });
  }
);

export const updatePaymentConfig = asyncHandler(
  async (req, res) => {

    const config =
      await updatePaymentConfigService({
        paymentConfigId: Number(req.params.id),
        updateData: req.body
      });

    return res.status(200).json({
      success: true,
      message: "Payment config updated successfully",
      data: config
    });
  }
);

export const getPaymentConfig = asyncHandler(
  async (req, res) => {

    const config =
      await getPaymentConfigService({
        ownerId: req.user.id
      });

    return res.status(200).json({
      success: true,
      data: config
    });
  }
);