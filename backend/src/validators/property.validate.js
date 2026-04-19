import {z} from "zod";

export const propertySchema = z.object({
    propertyName: z.string({required_error:"property name is required"}).min(3).max(30),
    state: z.string({required_error:"State is required"}),
    city: z.string({required_error:"city is required"}),
    address: z.string({required_error:"address is required"}),
    pincode: z.string().length(6, "Pincode must be 6 digits"),
})

export const updatePropertySchema = z
  .object({
    propertyName: z.string().min(3).max(30).optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    pincode: z.string().length(6).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });