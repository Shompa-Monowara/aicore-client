"use server";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const addPrompt = async (prompt, token) => {
  const res = await fetch(`${baseURl}/user/prompts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prompt),
  });

  return await res.json();
};

export const updatePrompt = async (id, data, token) => {
  const res = await fetch(`${baseURl}/user/prompts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};

export const deletePrompt = async (id, token) => {
  const res = await fetch(`${baseURl}/user/prompts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

// export const getPromptAnalytics = async (promptId) => {
//   const res = await fetch(`${baseURl}/api/prompts/${promptId}/analytics`, {
//     cache: "no-store",
//   });

//   return await res.json();
// };
