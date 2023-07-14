import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const Page = async ({}) => {
  const sesstion = await getServerSession(authOptions);

  return <pre>{JSON.stringify(sesstion)}</pre>;
};

export default Page;
