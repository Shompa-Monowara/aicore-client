"use server";

import { getTokenServer } from "../getTokenServer";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const incrementCopyCount = async (id, email, token) => {
  const res = await fetch(`${baseURl}/prompts/${id}/copy`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
  return await res.json();
};

export const toggleBookmark = async (email, promptId, token) => {
  const res = await fetch(`${baseURl}/bookmarks/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, promptId }),
  });
  return await res.json();
};


export const submitReview = async (review) => {
  const token = await getTokenServer();
  const res = await fetch(`${baseURl}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  });
  return await res.json();
};

export const submitReport = async (report) => {
  const token = await getTokenServer();
  const res = await fetch(`${baseURl}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(report),
  });
  return await res.json();
};