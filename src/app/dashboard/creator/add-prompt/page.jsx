import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenServer } from "@/lib/getTokenServer";
import { getMyPrompts } from "@/lib/api/prompts";
import AddPromptForm from "@/components/.../AddPromptForm";

export default async function AddPromptPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const token = await getTokenServer();

  const myPromptsData = await getMyPrompts(session?.user?.email, token);
  const totalExistingPrompts = myPromptsData?.data?.length || 0;

  return (
    <AddPromptForm 
      totalExistingPrompts={totalExistingPrompts} 
      token={token} 
    />
  );
}