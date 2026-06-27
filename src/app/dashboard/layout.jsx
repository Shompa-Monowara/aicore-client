import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#080810] overflow-hidden">
   
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-1 overflow-hidden relative z-10">
     
        <DashboardSidebar />

       
        <div className="flex-1 overflow-auto flex flex-col bg-zinc-950/20">
          <main className="p-6 md:p-8 flex-1 text-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}