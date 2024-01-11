"use server";
import { Roles } from "@/models/schema/User";
import { closeDBConnection, connectToDB } from "@/service/mongo";
// import { UserService } from "@peterkapena/user_auth";
// import { DuplicateCheck } from "@peterkapena/user_auth/src/services/UserService";
import { FormSchema, FormSchemaType } from "./form-schema";
import { DuplicateCheck, UserService } from "@/service/user.services";

export async function initializeUser() {
  return signUp({
    confirm_password: process.env.PETER_KAPENA_PASSWORD || "",
    password: process.env.PETER_KAPENA_PASSWORD || "",
    email: process.env.PETER_KAPENA_EMAIL || "",
    username: process.env.PETER_KAPENA_EMAIL?.split("@")[0] || "",
  });
}

export async function signUp(cred: FormSchemaType): Promise<Boolean> {
  try {
    if (await connectToDB()) {
    }
    const { email, password, username } = FormSchema.parse(cred);
    console.log(cred);

    const result = await new UserService().signUp(
      {
        email,
        password,
        roles:
          email.includes("peterkapenapeter") ||
          process.env.NODE_ENV === "development"
            ? [...Object.keys(Roles)]
            : [],
        username,
      },
      DuplicateCheck.BOTH_USERNAME_EMAIL
    );
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    closeDBConnection();
  }
}
