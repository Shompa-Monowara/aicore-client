import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#0b0813]">
      <div className="flex flex-1 overflow-hidden">

        <DashboardSidebar />

        <div className="flex-1 overflow-auto flex flex-col">

          <main className="p-5 flex-1 text-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}