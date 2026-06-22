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