// validators/paymentConfig.validator.js

import { z } from "zod";

export const createPaymentConfigSchema =
  z.object({

    body: z.object({

      razorpayEnabled:
        z.boolean(),

      mode:
        z.enum(["TEST", "LIVE"]),

      testKeyId:
        z.string().optional(),

      testKeySecret:
        z.string().optional(),

      liveKeyId:
        z.string().optional(),

      liveKeySecret:
        z.string().optional()

    })
});

export const updatePaymentConfigSchema =
  z.object({

    params: z.object({
      id: z.string().regex(/^\d+$/)
    }),

    body: z.object({

      razorpayEnabled:
        z.boolean().optional(),

      mode:
        z.enum(["TEST", "LIVE"]).optional(),

      testKeyId:
        z.string().optional(),

      testKeySecret:
        z.string().optional(),

      liveKeyId:
        z.string().optional(),

      liveKeySecret:
        z.string().optional()

    })
});