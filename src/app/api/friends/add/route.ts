import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // take email from request body and validator
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // find user in database
    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    // if user dont found
    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 400 });
    }

    // if sender is unauthorized
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // if sender and user in one the same
    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

    // check if a user is already added
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;
    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 });
    }

    // check if a user is already friend
    const isAlreadyFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;
    if (isAlreadyFriend) {
      return new Response("Already friends with this user", { status: 400 });
    }

    //valid request, send friend request

    // push notification for user that we want add
    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {
        senderId: session.user.id,
        senderEmail: session.user.email,
      }
    );

    // send friend request in database
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
