import { z } from "zod";
export const FormSchema = z.object({
  password: z
    .string({})
    .nonempty("this is required")
    .min(8, "Not shorter than 8")
    .max(100, "This must be less than 100 characters long"),
  email_or_username: z
    .string({})
    .nonempty("this is required")
    //.email("Invalid email")
    .max(100, "This must be less than 100 characters long"),
});
export type FormSchemaType = z.infer<typeof FormSchema>;

export interface ValidationResult {
  success: boolean;
  data: FormSchemaType;
  _id?: string;
}
