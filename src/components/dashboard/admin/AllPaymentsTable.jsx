import { HiOutlineUser, HiOutlineCalendar } from "react-icons/hi";

export default function AllPaymentsTable({ payments }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-purple-950/20 text-left text-zinc-500 uppercase text-[11px] tracking-wider">
            <th className="px-5 py-4">Transaction ID</th>
            <th className="px-5 py-4">Purchaser Details</th>
            <th className="px-5 py-4">Billing Email</th>
            <th className="px-5 py-4">Amount Charged</th>
            <th className="px-5 py-4">Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment._id}
              className="border-b border-purple-950/10 hover:bg-zinc-900/30 transition-colors"
            >
              <td className="px-5 py-4">
                <span className="font-mono text-xs text-cyan-400">
                  {payment.sessionId}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-start gap-2">
                  <HiOutlineUser className="text-zinc-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white font-semibold">
                      {payment.purchaserName || "Deleted Account"}
                    </p>
                    {payment.purchaserId && (
                      <p className="text-zinc-500 text-[11px]">
                        ID: {payment.purchaserId.toString()}
                      </p>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 text-zinc-300">{payment.email}</td>

              <td className="px-5 py-4">
                <span className="text-emerald-400 font-bold">
                  ${Number(payment.amount).toFixed(2)}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                  <HiOutlineCalendar />
                  {payment.createdAt
                    ? new Date(payment.createdAt).toLocaleString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                    : "—"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}