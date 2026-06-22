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