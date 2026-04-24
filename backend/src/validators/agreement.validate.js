import { z } from "zod";

// =========================
// CREATE AGREEMENT
// =========================
export const createAgreementSchema = z.object({
  params: z.object({
    propertyId: z.string().regex(/^\d+$/, "propertyId must be a number"),
    roomId: z.string().regex(/^\d+$/, "roomId must be a number"),
  }),

  body: z.object({
    renterId: z.number().int().positive("renterId must be a positive number"),

    rent: z.number().positive("Rent must be greater than 0"),

    deposit: z
      .number()
      .nonnegative("Deposit cannot be negative")
      .optional(),

    startDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), "Invalid start date"),

    dueDay: z
      .number(),

    electricityRate: electricityRate ? z.number() : 0,

    endDate: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(Date.parse(date)),
        "Invalid end date"
      ),
  })
  // ADVANCED VALIDATION (important)
  .refine((data) => {
    const { startDate, endDate } = data.body;

    if (endDate) {
      return new Date(startDate) < new Date(endDate);
    }
    return true;
  }, {
    message: "End date must be after start date",
    path: ["body", "endDate"],
  }),
});


// =========================
// END AGREEMENT
// =========================
export const endAgreementSchema = z.object({
  params: z.object({
    agreementId: z.string().regex(/^\d+$/, "agreementId must be a number"),
    propertyId: z.string().regex(/^\d+$/, "propertyId must be a number"),
    roomId: z.string().regex(/^\d+$/, "roomId must be a number"),
  }),
});


// =========================
// GET SINGLE AGREEMENT
// =========================
export const getSingleAgreementSchema = z.object({
  params: z.object({
    agreementId: z.string().regex(/^\d+$/, "agreementId must be a number"),
  }),
});