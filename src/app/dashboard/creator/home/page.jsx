import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenServer } from "@/lib/getTokenServer";
import { getCreatorAnalytics } from "@/lib/api/prompts";
import CreatorAnalyticsDashboard from "../CreatorAnalyticsDashboard";


export default async function CreatorHomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const token = await getTokenServer();
  const email = session?.user?.email;

  const analyticsData = await getCreatorAnalytics(email, token);

  return <CreatorAnalyticsDashboard analyticsData={analyticsData} />;
}