const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getPrompts = async () => {
  const res = await fetch(`${baseURl}/user/prompts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
};

export const getMyPrompts = async (email) => {
  const res = await fetch(`${baseURl}/user/prompts?email=${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
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
  const params = new URLSearchParams({
    search,
    category,
    aiTool,
    difficulty,
    sort,
    page,
    limit,
  });
  const res = await fetch(`${baseURl}/prompts/public?${params}`);
  const data = await res.json();
  return data;
};