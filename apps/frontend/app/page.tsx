import { useApiClient } from "@/lib/api";
import { createServerApiClient } from "@/lib/api/api.server";
import { auth } from "@clerk/nextjs/server";

export default async function RootPage() {
  const api = await createServerApiClient();
  // const api2 = useApiClient()
  return <div></div>;
}
