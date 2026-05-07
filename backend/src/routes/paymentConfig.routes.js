// routes/paymentConfig.routes.js

import express from "express";

import {
  createPaymentConfig,
  updatePaymentConfig,
  getPaymentConfig
} from "../controllers/paymentConfig.controller.js";

import validate from "../middlewares/validate.middleware.js";

import {
  createPaymentConfigSchema,
  updatePaymentConfigSchema
} from "../validators/paymentConfig.validator.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  validate(createPaymentConfigSchema),
  createPaymentConfig
);

router.get(
  "/",
  protect,
  getPaymentConfig
);

router.patch(
  "/:id",
  protect,
  validate(updatePaymentConfigSchema),
  updatePaymentConfig
);

export default router;