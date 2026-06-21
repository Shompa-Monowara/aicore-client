import AddPromptForm from "@/components/dashboard/user/AddPromptForm";
import { getPrompts } from "@/lib/api/prompts";
import React from "react";

export default async function AddPromptPage() {
  const promptsData = await getPrompts();

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