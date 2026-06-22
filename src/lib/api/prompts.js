const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getPrompts = async () => {
  const res = await fetch(`${baseURl}/user/prompts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
};

export const getMyPrompts = async (email) => {
  const res = await fetch(`${baseURl}/user/prompts?email=${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
};

export const fetchPublicPrompts = async ({
  search = "",
  category = "",
  aiTool = "",
  difficulty = "",
  sort = "latest",
  page = 1,
  limit = 9,
} = {}) => {
  const params = new URLSearchParams({ search, category, aiTool, difficulty, sort, page, limit });
  const res = await fetch(`${baseURl}/prompts/public?${params}`);
  return await res.json();
};

export const getPromptById = async (id) => {
  if (!id) return null;
  const cleanId = typeof id === "object" ? (id?.$oid || id?.toString()) : id;
  const res = await fetch(`${baseURl}/prompts/${cleanId}`);
  if (!res.ok) return null;
  return await res.json();
};

export const getPromptReviews = async (promptId) => {
  const res = await fetch(`${baseURl}/reviews/${promptId}`);
  return await res.json();
};

export const checkBookmarkStatus = async (email, promptId) => {
  if (!email) return { bookmarked: false };
  const res = await fetch(`${baseURl}/bookmarks/status?email=${email}&promptId=${promptId}`);
  return await res.json();
};