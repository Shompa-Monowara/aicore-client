const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getAdminAnalytics = async (token) => {
  const res = await fetch(`${baseURl}/admin/analytics`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    cache: "no-store"
  });
  const data = await res.json();
  return data;
};

export const getAllUsers = async (token, page = 1, limit = 10) => {
  const res = await fetch(`${baseURl}/admin/users?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    cache: "no-store"
  });
  const data = await res.json();
  return data;
};

export const getAllPrompts = async (token) => {
  const res = await fetch(`${baseURl}/admin/prompts`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    cache: "no-store"
  });
  const data = await res.json();
  return data;
};

export const getReportedPrompts = async (token) => {
  const res = await fetch(`${baseURl}/admin/reports`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    cache: "no-store"
  });
  const data = await res.json();
  return data;
};

export const getAllPayments = async (token) => {
  const res = await fetch(`${baseURl}/admin/payments`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    cache: "no-store"
  });
  const data = await res.json();
  return data;
};