import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

/**
 * Setting NextAuth
 */
export default NextAuth(authOptions);
