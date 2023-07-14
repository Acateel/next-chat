import { z } from "zod";

/**
 * Validation for addFriend function
 * chech what email is string and has email's format
 */
export const addFriendValidator = z.object({
  email: z.string().email(),
});
