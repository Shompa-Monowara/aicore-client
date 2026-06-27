"use server";

import { getTokenServer } from "../getTokenServer";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const addPrompt = async (prompt) => {
  const token = await getTokenServer();
  const res = await fetch(`${baseURl}/user/prompts`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(prompt),
  });
  return await res.json();
};

export const deletePrompt = async (id) => {
  const token = await getTokenServer();
  const res = await fetch(`${baseURl}/user/prompts/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return await res.json();
};

export const updatePrompt = async (id, data) => {
  const token = await getTokenServer();
  const res = await fetch(`${baseURl}/user/prompts/${id}`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const getPromptAnalytics = async (promptId) => {
  try {
    const res = await fetch(`${baseURl}/api/prompts/${promptId}/analytics`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return null;
  }
};
