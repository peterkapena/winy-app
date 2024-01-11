import { z } from "zod";
export const FormSchema = z.object({
  name: z
    .string({})
    .min(1, "this is required")
    .max(50, "50 characters max allowed"),
  year: z
    .number({ required_error: "year is required", invalid_type_error: "year is required" })
    .min(1600, "invalid year")
    .max(new Date().getFullYear(), "invalid year"),
  type: z.enum(['Red', 'White', 'Rosé', 'White Blend', 'Red Blend']),
  varietal: z
    .string({})
    .min(1, "this is required"),
  rating: z
    .number({ invalid_type_error: "invalid rating", required_error: "required", })
    .min(1, "this is required")
    .max(5, "This must be less than 10 characters long").optional(),
  consumed: z.boolean().optional(),
  date_consumed: z.coerce.date({ invalid_type_error: "invalid date", required_error: "required" })
}).refine((data) => data.consumed && data.date_consumed, {
  message: "required",
  path: ["date_consumed"],
})

export type FormSchemaType = z.infer<typeof FormSchema>;

export interface ValidationResult {
  success: boolean;
  data: FormSchemaType;
  _id?: string;
}
