// validations/payment.validation.js

import { z } from "zod";


// ===============================
// MANUAL PAYMENT
// ===============================
export const manualPaymentSchema = z.object({
  params: z.object({
    billId: z.string().regex(/^\d+$/, "Bill ID must be number")
  }),

  body: z.object({
    amount: z.number().positive("Amount must be greater than 0"),

    proofUrl: z.string()
      .url("Invalid proof URL")
  })
});


// ===============================
// APPROVE / REJECT PAYMENT
// ===============================
export const updatePaymentStatusSchema = z.object({

  params: z.object({
    paymentId: z.string().regex(/^\d+$/, "Payment ID must be number")
  }),

  body: z.object({
    status: z.enum(["SUCCESS", "REJECTED"]),

    rejectionNote: z.string().optional()
  })

  .refine((data) => {

    if (data.status === "REJECTED") {
      return !!data.rejectionNote;
    }

    return true;

  }, {
    message: "Rejection note required",
    path: ["rejectionNote"]
  })
});


// ===============================
// RETRY PAYMENT
// ===============================
export const retryPaymentSchema = z.object({

  params: z.object({
    billId: z.string().regex(/^\d+$/, "Bill ID must be number")
  }),

  body: z.object({
    proofUrl: z.string()
      .url("Invalid proof URL")
  })
});


// ===============================
// GET PAYMENTS
// ===============================
export const getPaymentsSchema = z.object({

  params: z.object({
    billId: z.string().regex(/^\d+$/, "Bill ID must be number")
  })
});

// ===============================
// CREATE RAZORPAY ORDER
// ===============================
export const createRazorypayOrderSchema = z.object({
  params: z.object({
    billId: z.string().regex(/^\d+$/, "Bill ID must be number")
  })
})

// ===============================
// VERIFY RAZORPAY PAYMENT
// ===============================
export const verifyRazorpayOrderSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string()
  })
})