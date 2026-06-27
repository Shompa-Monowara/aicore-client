import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenServer = async () => {
  try {
    const response = await auth.api.getSession({
      headers: await headers(),
      asResponse: true,
    });

    if (!response) return null;

    const token = response.headers.get("set-auth-jwt");
    return token || null;
  } catch (error) {
    console.error("getTokenServer error:", error);
    return null;
  }
};