import { ComponentExample } from "@/components/component-example";
import { createServerApiClient } from "@/lib/api/api.server";

export default async function Page() {
  const api = await createServerApiClient();

  const data = await api.User.getMe();

  console.log(data);
  return <ComponentExample />;
}
