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
  rating: z.union([z.number().multipleOf(.1).positive(), z.nan()]).optional(),
  consumed: z.boolean().optional(),
  date_consumed: z.coerce.date().optional()
})


export type FormSchemaType = z.infer<typeof FormSchema>;

export interface ValidationResult {
  success: boolean;
  data: FormSchemaType;
  _id?: string;
}
