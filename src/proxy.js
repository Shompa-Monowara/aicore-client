import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;
  const user = session?.user;

  // ১. ইউজার লগইন না থাকলে লগইন পেজে পাঠান
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const role = user.role?.toLowerCase() || "user";
  const plan = user.plan?.toLowerCase() || "free";

  // 🎯 ২. ইতিমধ্যে premium হলে পেমেন্ট পেজে ঢুকতে না দিয়ে রোল অনুযায়ী সঠিক প্রোফাইলে পাঠান
  if (pathname.startsWith("/payment") && plan === "premium") {
    // রোল অনুযায়ী ড্যাশবোর্ড ইউআরএল তৈরি করা হচ্ছে (যেমন: /dashboard/creator/profile বা /dashboard/user/profile)
    const dashboardRoute = `/dashboard/${role}/profile`;
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }

  // ৩. এডমিন ড্যাশবোর্ড প্রোটেকশন
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // ৪. ক্রিয়েটর ড্যাশবোর্ড প্রোটেকশন
  if (
    pathname.startsWith("/dashboard/creator") &&
    role !== "creator" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

// 🎯 প্রক্সি ট্র্যাকিং কনফিগারেশন
export const config = {
  matcher: ["/dashboard/:path*", "/payment"],
};