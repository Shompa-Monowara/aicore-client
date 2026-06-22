"use server";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const updateUserRole = async (id, role) => {
  const res = await fetch(`${baseURl}/admin/users/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  return data;
};

export const deleteUser = async (id) => {
  const res = await fetch(`${baseURl}/admin/users/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data;
};

// new
export const updatePromptStatus = async (id, status, feedback = "") => {
  const res = await fetch(`${baseURl}/admin/prompts/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, feedback }),
  });
  const data = await res.json();
  return data;
};

export const togglePromptFeatured = async (id, featured) => {
  const res = await fetch(`${baseURl}/admin/prompts/${id}/feature`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ featured }),
  });
  const data = await res.json();
  return data;
};

export const dismissReport = async (id) => {
  const res = await fetch(`${baseURl}/admin/reports/${id}/dismiss`, {
    method: "PATCH",
  });
  const data = await res.json();
  return data;
};

export const warnCreator = async (id) => {
  const res = await fetch(`${baseURl}/admin/reports/${id}/warn`, {
    method: "PATCH",
  });
  const data = await res.json();
  return data;
};

export const removeReportedPrompt = async (id) => {
  const res = await fetch(`${baseURl}/admin/reports/${id}/remove-prompt`, {
    method: "DELETE",
  });
  const data = await res.json();
  return data;
};