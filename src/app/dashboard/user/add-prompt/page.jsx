import AddPromptForm from "@/components/dashboard/user/AddPromptForm";
import { getMyPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AddPromptPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const promptsData = await getMyPrompts(session?.user?.email);

  return (
    <div className="w-full py-6 px-4">
      <div className="w-full max-w-3xl mx-auto mb-4">
        <h1 className="text-2xl font-bold text-white">Prompts Management</h1>
      </div>
      <div className="w-full">
        <AddPromptForm totalExistingPrompts={promptsData.totalData || 0} />
      </div>
    </div>
  );
}