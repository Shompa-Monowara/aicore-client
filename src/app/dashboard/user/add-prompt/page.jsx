import AddPromptForm from "@/components/dashboard/user/AddPromptForm";
import { getMyPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenServer } from "@/lib/getTokenServer"; 
export default async function AddPromptPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const token = await getTokenServer(); 
  
  const promptsData = await getMyPrompts(session?.user?.email, token); 

  return (
    <div className="w-full py-6 pl-4 md:pl-8 pr-4">
      <div className="w-full max-w-4xl ml-0 mb-6">
        <h1 className="text-3xl font-black text-white tracking-wide">
          Create New Prompt Template
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5 pl-0">
          Share your creative prompt with the world and inspire the community.
        </p>
      </div>

      <div className="w-full max-w-4xl ml-0">
        <AddPromptForm totalExistingPrompts={promptsData.totalData || 0} token={token} /> 
      </div>
    </div>
  );
}