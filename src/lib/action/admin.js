"use server";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const changeUserRole = async (id, role, token) => {
  const res = await fetch(`${baseURl}/admin/users/${id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  return await res.json();
};

export const deleteUser = async (id, token) => {
  const res = await fetch(`${baseURl}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return await res.json();
};

export const updatePromptStatus = async (id, status, rejectionFeedback = "", token) => {
  const res = await fetch(`${baseURl}/admin/prompts/${id}/status`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({ status, rejectionFeedback }),
  });
  const data = await res.json();
  return data;
};

export const togglePromptFeatured = async (id, featured, token) => {
  const res = await fetch(`${baseURl}/admin/prompts/${id}/feature`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({ featured }),
  });
  const data = await res.json();
  return data;
};

export const dismissReport = async (id, token) => {
  const res = await fetch(`${baseURl}/admin/reports/${id}/dismiss`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}` 
    }
  });
  const data = await res.json();
  return data;
};

export const warnCreator = async (id, token) => {
  const res = await fetch(`${baseURl}/admin/reports/${id}/warn`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}` 
    }
  });
  const data = await res.json();
  return data;
};

export const removeReportedPrompt = async (id, token) => {
  const res = await fetch(`${baseURl}/admin/reports/${id}/remove-prompt`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}` 
    }
  });
  const data = await res.json();
  return data;
};