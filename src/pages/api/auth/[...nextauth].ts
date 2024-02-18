import connectToMongoDB from "../../../configs/mongodb";
import User from "../../models/userModel";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: Record<string, string> | undefined, req) {
        // Ensure credentials are defined and have the necessary properties
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const { email, password } = credentials;

        try {
          await connectToMongoDB();
          const user = await User.findOne({ email }).exec();

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as default };
