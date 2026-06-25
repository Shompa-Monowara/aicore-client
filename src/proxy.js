import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// 🎯 এটি Next.js এর নতুন ভার্সন অনুযায়ী একদম পারফেক্ট 'proxy' এক্সপোর্ট মেথড
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;
  const user = session?.user;

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const role = user.role;
  const plan = user.plan?.toLowerCase();

  // 🎯 ইতিমধ্যে premium হলে পেমেন্ট পেজে ঢুকতে না দিয়ে সরাসরি প্রোফাইল পেজে পাঠিয়ে দেওয়া সবচেয়ে নিরাপদ
  if (pathname.startsWith("/payment") && plan === "premium") {
    return NextResponse.redirect(new URL("/dashboard/user/profile", request.url));
  }

  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

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