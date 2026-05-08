// routes/payment.routes.js

import express from "express";

import protect from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";

import {
  submitManualPayment,
  updateManualPaymentStatus,
  retryManualPayment,
  markBillPaidByOwner,
  getBillPayments,
  createRazorPayOrder,
  verifyRazorpayPayment
} from "../controllers/payment.controller.js";

import {
  manualPaymentSchema,
  updatePaymentStatusSchema,
  retryPaymentSchema,
  getPaymentsSchema
} from "../validations/payment.validation.js";
import { createRazorypayOrderSchema, verifyRazorpayOrderSchema } from "../validators/payment.validation.js";

const router = express.Router();


// renter submit payment
router.post(
  "/bill/:billId/manual",
  protect,
  validate(manualPaymentSchema),
  submitManualPayment
);


// owner approve/reject
router.patch(
  "/:paymentId/status",
  protect,
  validate(updatePaymentStatusSchema),
  updateManualPaymentStatus
);


// renter retry
router.post(
  "/bill/:billId/retry",
  protect,
  validate(retryPaymentSchema),
  retryManualPayment
);


// owner manual mark
router.patch(
  "/:paymentId/mark-paid",
  protect,
  markBillPaidByOwner
);


// payment history
router.get(
  "/bill/:billId",
  protect,
  validate(getPaymentsSchema),
  getBillPayments
);

// create razor pay order
router.post('/bill/:billId', protect,validate(createRazorypayOrderSchema), createRazorPayOrder);

// verify razorpay payment
router.post("/bill/verify", protect,validate(verifyRazorpayOrderSchema), verifyRazorpayPayment);

export default router;