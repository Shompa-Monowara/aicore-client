import { getAllPayments } from "@/lib/api/admin";
import AllPaymentsTable from "@/components/dashboard/admin/AllPaymentsTable";
import { HiOutlineCreditCard } from "react-icons/hi";
import { getTokenServer } from "@/lib/getTokenServer"; // 🎯 টোকেন ইম্পোর্ট

export default async function AllPaymentsPage() {
  const token = await getTokenServer(); // 🎯 টোকেন রিড
  const paymentsData = await getAllPayments(token); // 🎯 টোকেন পাস
  const payments = paymentsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Stripe Premium Payments Log
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5">
          Comprehensive database of customer subscription transactions.
        </p>
      </div>

      <div className="mt-8 bg-zinc-900/10 border border-purple-950/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-4">
            <div className="w-12 h-12 rounded-xl border border-purple-950/40 bg-purple-950/10 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <HiOutlineCreditCard className="text-2xl" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-white font-bold text-base">No payments yet</h2>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                Transactions will appear here once users upgrade to premium networks.
              </p>
            </div>
          </div>
        ) : (
          <AllPaymentsTable payments={payments} />
        )}
      </div>
    </div>
  );
}