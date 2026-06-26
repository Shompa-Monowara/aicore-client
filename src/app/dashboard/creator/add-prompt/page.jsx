import AddPromptForm from "@/components/dashboard/user/AddPromptForm";
import { getMyPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function CreatorAddPromptPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const promptsData = await getMyPrompts(session?.user?.email);

  return (
    <div className="w-full py-6 px-4 md:px-8">
     
      <div className="w-full max-w-4xl mb-6">
        <h1 className="text-3xl font-black text-white tracking-wide">
          Create New Prompt Template
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5">
          Share your creative prompt with the world and inspire the community.
        </p>
      </div>

   
      <div className="w-full max-w-4xl">
        <AddPromptForm 
          totalExistingPrompts={promptsData?.totalData || 0} 
          role="creator" 
        />
      </div>
    </div>
  );
}