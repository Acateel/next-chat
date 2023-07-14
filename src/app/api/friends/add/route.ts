import { authOptions } from "@/lib/auth";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    // take email from request body and validator
    const body = await req.json();
    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    // find user in database
    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    // take user id
    const data = (await RESTResponse.json()) as { result: string | null };
    const idToAdd = data.result;

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

    //valid request

    console.log(data);
  } catch (error) {}
}
