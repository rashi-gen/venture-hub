// auth.ts
import authConfig from "@/auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "./validaton-schema";
import { findUserById } from "./actions/user";
import { db } from "./db";

export type ExtendedUser = DefaultSession["user"] & {
  role: Role;
  mustChangePassword: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    mustChangePassword?: boolean;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error:  "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await findUserById(user.id!);
      // Block login if user doesn't exist or email isn't verified
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
      return true;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await findUserById(token.sub);
      if (!existingUser) return token;

      token.role               = existingUser.role;
      token.mustChangePassword = existingUser.mustChangePassword; // ← NEW

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (session.user) {
        // ← NEW — exposes mustChangePassword to client session + middleware
        session.user.mustChangePassword = token.mustChangePassword ?? false;
      }
      return session;
    },
  },
  ...authConfig,
});