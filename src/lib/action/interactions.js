"use server";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

{/* নতুন */}
export const incrementCopyCount = async (id, email) => {
  const res = await fetch(`${baseURl}/prompts/${id}/copy`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  return data;
};

export const toggleBookmark = async (email, promptId) => {
  const res = await fetch(`${baseURl}/bookmarks/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, promptId }),
  });
  const data = await res.json();
  return data;
};

export const submitReview = async (review) => {
  const res = await fetch(`${baseURl}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  const data = await res.json();
  return data;
};

export const submitReport = async (report) => {
  const res = await fetch(`${baseURl}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  const data = await res.json();
  return data;
};