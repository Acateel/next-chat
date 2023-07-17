import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { fetchRedis } from "@/helpers/redis";

/**
 * Get credentials for Google auth form env.
 * if it don't find credentials, will throw error
 * @returns id and secret for Google auth
 */
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}

/**
 * Options of NextAuth
 */
export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // take user from db
      const dbUserResult = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;

      // if dont find user, will return token only with user id
      if (!dbUserResult) {
        if (user) {
          token.id = user!.id;
        }
        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      // if find user, will return token with db user data
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    /**
     * Will take user data from token into session if have token
     * @returns session
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    /**
     * After succsess login go to dashboard page
     */
    redirect() {
      return "/dashboard";
    },
  },
};
