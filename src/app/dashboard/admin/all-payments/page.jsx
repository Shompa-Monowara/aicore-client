import { getAllPayments } from "@/lib/api/admin";
import AllPaymentsTable from "@/components/dashboard/admin/AllPaymentsTable";

export default async function AllPaymentsPage() {
  const paymentsData = await getAllPayments();
  const payments = paymentsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">
        Stripe Premium Payments Log
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Comprehensive database of customer subscription transactions.
      </p>

      <div className="mt-6 bg-zinc-900/30 border border-purple-950/20 rounded-2xl overflow-hidden">
        {payments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white font-bold">No payments yet</p>
            <p className="text-zinc-500 text-sm mt-1">
              Transactions will appear here once users upgrade to premium.
            </p>
          </div>
        ) : (
          <AllPaymentsTable payments={payments} />
        )}
      </div>
    </div>
  );
}