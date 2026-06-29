import { Suspense } from "react";
import AllPromptsPage from "./AllPromptsPage";


function AllPromptsLoading() {
  return (
    <div className="min-h-screen bg-[#080810] flex justify-center items-center">
      <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<AllPromptsLoading />}>
      <AllPromptsPage />
    </Suspense>
  );
}