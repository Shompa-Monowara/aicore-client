const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const confirmPayment = async (paymentData) => {
  const res = await fetch(`${baseURl}/payments/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  return await res.json();
};

export const getAllPayments = async () => {
  const res = await fetch(`${baseURl}/admin/payments`);
  return await res.json();
};