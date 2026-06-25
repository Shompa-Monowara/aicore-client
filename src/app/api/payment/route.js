import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    // Better Auth সেশন রিট্রিভ করা
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });
    const user = userSession?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // হোস্টেড সেশনের পরিবর্তে ইনলাইন পেমেন্ট ইনটেন্ট তৈরি
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500, // $5.00 = 500 cents
      currency: "usd",
      receipt_email: user.email,
      metadata: {
        userId: user.id,
        userEmail: user.email,
        productId: "premium_plan",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

   
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}