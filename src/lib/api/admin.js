// lib/api/admin.js
const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getAdminAnalytics = async () => {
  const res = await fetch(`${baseURl}/admin/analytics`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
};


export const getAllUsers = async () => {
  const res = await fetch(`${baseURl}/admin/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
};

// new 
export const getAllPrompts = async () => {
  const res = await fetch(`${baseURl}/admin/prompts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
};

export const getReportedPrompts = async () => {
  const res = await fetch(`${baseURl}/admin/reports`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
};

export const getAllPayments = async () => {
  const res = await fetch(`${baseURl}/admin/payments`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
};