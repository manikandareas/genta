import { createServerApiClient } from "@/lib/api/api.server";
import { auth } from "@clerk/nextjs/server";

export default async function RootPage() {
  const { getToken } = await auth();

  const token = await getToken();
  return <div className="w-full min-h-svh">Token: {token}</div>;
}
