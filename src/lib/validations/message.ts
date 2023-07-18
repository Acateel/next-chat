import z from "zod";

/**
 * Validation for one message
 */
export const messageValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  receverId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

/**
 * Validation for message array
 */
export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
