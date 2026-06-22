"use server";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const addPrompt = async (prompt) => {
  const res = await fetch(`${baseURl}/user/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prompt),
  });
  return await res.json();
};

export const deletePrompt = async (id) => {
  const res = await fetch(`${baseURl}/user/prompts/${id}`, {
    method: "DELETE",
  });
  return await res.json();
};