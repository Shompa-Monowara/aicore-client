"use server";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;


export const addPrompt = async (prompt) => {
  const res = await fetch(`${baseURl}/user/prompts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prompt),
  });

  const data = await res.json();
  return data;
};