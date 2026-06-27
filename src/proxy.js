 import { NextResponse } from "next/server";
 import { headers } from "next/headers";
 import { auth } from "@/lib/auth";

  export async function proxy(request) {
  const session = await auth.api.getSession({
     headers: await headers(),
   });

   const { pathname } = request.nextUrl;
   const user = session?.user;


   if (!user) {
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

const role = (user.role || "user").toLowerCase();
const plan = (user.plan || "free").toLowerCase();

   if (pathname.startsWith("/payment") && plan === "premium") {
    
    const dashboardRoute = `/dashboard/${role}/profile`;
   return NextResponse.redirect(new URL(dashboardRoute, request.url));
   }

  
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    pathname.startsWith("/dashboard/creator") &&     role !== "creator" &&
     role !== "admin"
   ) {
     return NextResponse.redirect(new URL("/unauthorized", request.url));
  } 

 return NextResponse.next();
 }


 export const config = {
  matcher: ["/dashboard/:path*", "/payment"],
 };


// import { NextResponse } from "next/server";
// import { auth } from "./lib/auth";
// import { headers } from "next/headers"; 

// export async function proxy(request) {
//    const session = await auth.api.getSession({
//     headers: await headers()
//    }) 

//    if(session?.user?.role == "user" && session?.user?.plan === "free") {
//     return NextResponse.redirect(new URL('/payment', request.url))
//    }

//    if(!session){
//     return NextResponse.redirect(new URL('/auth/login', request.url))
//    }

// }

// export const config = {
//     matcher: ['/dashboard/user/profile', '/dashboard/creator/home', '/dashboard/admin/analytics']
// }