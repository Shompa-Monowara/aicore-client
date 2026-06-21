import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardUserMenu from "@/components/dashboard/DashboardUserMenu";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({ children }) {
 
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <div className="flex h-screen bg-[#0b0813]">
      <div className="flex flex-1 overflow-hidden">
     
        <DashboardSidebar />
        
       
        <div className="flex-1 overflow-auto flex flex-col">
          
          
          <div className="w-full h-16 border-b border-purple-950/30 bg-[#0b0813]/40 backdrop-blur-md flex items-center justify-end px-6 shrink-0">
            {user && (
              <div className="relative inline-block">
                <DashboardUserMenu initialUser={user} />
              </div>
            )}
          </div>
          
         
          <main className="p-5 flex-1 text-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}