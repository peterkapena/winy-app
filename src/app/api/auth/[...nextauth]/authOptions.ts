import { User, UserModel } from "@/models/schema/User";
import { connectToDB } from "@/service/mongo";
import { UserService } from "@/service/user.services";
import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface CustomSession extends Session {
  id: string;
  roles: string[];
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email_or_username: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDB();

          await new Promise((resolve) => setTimeout(resolve, 1000));

          console.log(credentials);
          const signedin = await new UserService().simple_signIn(
            credentials?.email_or_username || "",
            credentials?.password || ""
          );

          if (signedin?._id) {
            // Any object returned will be saved in `user` property of the JWT
            return {
              id: signedin._id.toString(),
              email: signedin.email || signedin.username,
              name: signedin.username,
            };
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
  },
  callbacks: {
    async session({ session, user, token }) {
      const usr = (await UserModel.findById(token.sub)) as User;
      const ss: CustomSession = {
        ...session,
        id: usr._id?.toString() || "",
        roles: usr.roles || [],
      };

      user = {
        ...user,
        ...session.user,
        email: usr.email,
        id: usr._id?.toString() || "",
      };

      return { ...ss, user };
    },
  },
};
