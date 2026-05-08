// controllers/payment.controller.js

import asyncHandler from "../utils/asyncHandler.js";

import {
  manualPaymentService,
  manualBillApproval,
  ownerMarkManually,
  retryPayment,
  getPaymentsByBillService,
  createRazorPayOrderService,
  verifyRazorpayPaymentService
} from "../services/payment.service.js";
import prisma from "../config/db.js";
import AppError from "../utils/AppError.js";


// ===============================
// RENTER SUBMIT MANUAL PAYMENT
// ===============================
export const submitManualPayment = asyncHandler(async (req, res) => {

  const payment = await manualPaymentService({
    billId: Number(req.params.billId),
    userId: req.user.id,
    amount: Number(req.body.amount),
    proofUrl: req.body.proofUrl
  });

  return res.status(201).json({
    success: true,
    message: "Payment submitted successfully",
    data: payment
  });
});


// ===============================
// OWNER APPROVE / REJECT PAYMENT
// ===============================
export const updateManualPaymentStatus = asyncHandler(async (req, res) => {

  const payment = await manualBillApproval({
    ownerId: req.user.id,
    paymentId: Number(req.params.paymentId),
    status: req.body.status,
    rejectionNote: req.body.rejectionNote
  });

  return res.status(200).json({
    success: true,
    message: `Payment ${req.body.status.toLowerCase()} successfully`,
    data: payment
  });
});


// ===============================
// OWNER MARK BILL MANUALLY
// ===============================
export const markBillPaidByOwner = asyncHandler(async (req, res) => {

  const payment = await ownerMarkManually({
    ownerId: req.user.id,
    paymentId: Number(req.params.paymentId)
  });

  return res.status(200).json({
    success: true,
    message: "Bill marked paid successfully",
    data: payment
  });
});


// ===============================
// RENTER RETRY PAYMENT
// ===============================
export const retryManualPayment = asyncHandler(async (req, res) => {

  const payment = await retryPayment({
    renterId: req.user.id,
    billId: Number(req.params.billId),
    proofUrl: req.body.proofUrl
  });

  return res.status(201).json({
    success: true,
    message: "Payment retried successfully",
    data: payment
  });
});


// ===============================
// GET BILL PAYMENTS
// ===============================
export const getBillPayments = asyncHandler(async (req, res) => {

  const payments = await getPaymentsByBillService({
    billId: Number(req.params.billId),
    userId: req.user.id
  });

  return res.status(200).json({
    success: true,
    data: payments
  });
});

// ===============================
// Create Razorpay Order
// ===============================

export const createRazorPayOrder = asyncHandler(async(req, res) => {
  const {id} = req.user;
  const {billId} = req.body;

  const order = await createRazorPayOrderService({renterId:id, billId});

  return res.status(200).json({
    success: true,
    message:"Successfully order created",
    data: order
  })
})

// ===============================
// Verify Razorpay Payment
// ===============================
export const verifyRazorpayPayment = asyncHandler(async(req, res) => {
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;

  const payment = await verifyRazorpayPaymentService({razorpay_order_id, razorpay_payment_id, razorpay_signature});
  return res.status(200).json({
    success:true,
    message:"Successfully verified razorpay payment",
    data: payment
  })
})
