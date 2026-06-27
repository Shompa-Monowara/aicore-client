import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPromptById, getPromptReviews, checkBookmarkStatus } from "@/lib/api/prompts";
import PromptDetailClient from "@/components/prompts/PromptDetailClient";
import { getTokenServer } from "@/lib/getTokenServer"; 

export default async function PromptDetailPage({ params }) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    redirect("/auth/login");
  }

  
  const token = await getTokenServer();

  const prompt = await getPromptById(id);

  if (!prompt || prompt.message === "Prompt not found") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#080810] text-white">
        <p className="text-4xl mb-3">🤖</p>
        <p className="text-zinc-400 text-sm font-semibold">Prompt not found or has been removed.</p>
      </div>
    );
  }

  const reviewsData = await getPromptReviews(id);
  const reviews = reviewsData?.data || [];
  const bookmarkData = await checkBookmarkStatus(user?.email, id);

  return (
    <PromptDetailClient
      prompt={prompt}
      reviews={reviews}
      user={user}
      token={token} 
      initialBookmarked={bookmarkData?.bookmarked || false}
    />
  );
}