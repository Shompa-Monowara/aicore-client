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