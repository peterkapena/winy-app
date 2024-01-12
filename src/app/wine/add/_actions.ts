"use server";
import { WineService } from "@/service/wine.service";
import { FormSchemaType, FormSchema, ValidationResult } from "./form-schema";

export async function addWine(
  data: FormSchemaType,
  userId: string
): Promise<ValidationResult> {
  const result = FormSchema.safeParse(data);
  // console.log(userId)
  if (result.success) {
    try {
      const wine = await new WineService().addWine({
        ...data, userId,
        rating: data.rating || 0,
        consumed: data.consumed || false,
        date_consumed: data.consumed ? data.date_consumed : undefined
      })

      return { success: true, data, _id: wine._id?.toString() };
    } catch (error) {
      return { success: true, data };
    }
  }

  return { success: false, data };
}

export async function getWines(userId?: string) {
  if (userId) {
    const rtn = await new WineService().getWineByUser(userId)
    return JSON.stringify(rtn);
  }

  throw new Error("Invalid user id");
}

export async function getWine(id: string) {
  const rtn = await new WineService().getWine(id);
  return JSON.stringify(rtn);
}

export async function edit(
  data: FormSchemaType,
  userId: string,
  id: string | undefined
): Promise<Boolean> {
  const result = FormSchema.safeParse(data);

  if (result.success && id) {
    try {
      await new WineService().edit(
        {
          ...result.data,
          userId,
        },
        id
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  return false;
}

export async function _delete(id: String): Promise<boolean> {
  return await new WineService().delete(id);
}