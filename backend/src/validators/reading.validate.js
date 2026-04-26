import { z } from "zod";

export const addReadingSchema = z.object({
  params: z.object({
    agreementId: z.string().regex(/^\d+$/, "Agreement ID must be a number")
  }),
  body: z.object({
    units: z.number().positive("Units must be greater than 0"),
    imageUrl: z
      .string()
      .url("Image must be a valid URL")
  })
});


export const updateReadingStatusSchema = z.object({
  params: z.object({
    readingId: z.string().regex(/^\d+$/, "Reading ID must be a number")
  }),
  body: z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
    rejectionNote: z.string().optional()
  }).refine(
    (data) => {
      if (data.status === "REJECTED") {
        return !!data.rejectionNote;
      }
      return true;
    },
    {
      message: "Rejection note is required when status is REJECTED",
      path: ["rejectionNote"]
    }
  )
});


export const getBillsByPropertySchema = z.object({
  params: z.object({
    propertyId: z
      .string()
      .regex(/^\d+$/, "Property ID must be a number")
  })
});


export const getReadingsForRenterSchema = z.object({
  params: z.object({}).optional(),
  query: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    month: z.string().regex(/^\d+$/).optional(),
    year: z.string().regex(/^\d+$/).optional()
  }).optional()
});