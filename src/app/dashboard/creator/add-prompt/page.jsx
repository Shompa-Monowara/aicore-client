import CreatorAddPromptForm from "@/components/dashboard/creator/CreatorAddPromptForm";
import { getMyPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenServer } from "@/lib/getTokenServer"; 

export const dynamic = "force-dynamic";

export default async function CreatorAddPromptPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const token = await getTokenServer(); 
  
  const promptsData = await getMyPrompts(session?.user?.email, token); 
  return (
    <div className="w-full py-6 px-4 md:px-8 relative">
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-4xl mb-6 relative z-10">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Create New Prompt Template
        </h1>
        <p className="text-zinc-500 text-xs mt-1">
          Share your creative prompt with the world and inspire the community.
        </p>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <CreatorAddPromptForm
          totalExistingPrompts={promptsData?.totalData || 0} 
          role="creator" 
          token={token} 
        />
      </div>
    </div>
  );
}