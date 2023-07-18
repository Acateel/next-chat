import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    chatId: string;
  };
}

/**
 * Take chat ordered messages form databes
 * @param chatId chat if with format userId1--userId2
 * @returns reversed verified messages
 */
async function getChatMessages(chatId: string) {
  try {
    const result: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = result.map((message) => JSON.parse(message) as Message);
    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);
    return messages;
  } catch (error) {
    notFound();
  }
}

const Page = async ({ params }: PageProps) => {
  const { chatId } = params;

  // take user form session
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  // check if user have this chat
  if (user.id !== userId1 && user.id !== userId2) notFound();

  // take partner profile information
  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

  // take messages form database
  const initialMessages = await getChatMessages(chatId);

  return <div>{params.chatId}</div>;
};

export default Page;
