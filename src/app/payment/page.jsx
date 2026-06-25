"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { authClient } from "@/lib/auth-client";
import { HiCheckCircle, HiCreditCard, HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const promptId = searchParams.get("prompt_id");
  const { data: session } = authClient.useSession(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else if (paymentIntent.status === "succeeded") {
      toast.success("🎉 Payment successful!");

      const userEmail = session?.user?.email || ""; // 🎯 fix — Stripe response এর বদলে session

      window.location.href = `${SERVER_URL}/api/payment/success?session_id=${paymentIntent.id}&email=${encodeURIComponent(userEmail)}&prompt_id=${promptId || ""}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full min-h-[350px]">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-zinc-200">
          <HiCreditCard className="text-purple-400" /> Card Information
        </h3>

        <div className="w-full bg-[#121224] border border-zinc-850 rounded-xl p-4 mb-6 shadow-inner">
          <CardElement
            options={{
              style: {
                base: {
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  fontSmoothing: "antialiased",
                  fontSize: "14px",
                  "::placeholder": { color: "#52525b" },
                },
                invalid: { color: "#ef4444", iconColor: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full py-3.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 active:scale-[0.98] transition-all text-sm shadow-lg shadow-purple-600/20 disabled:opacity-50 text-white"
        >
          {loading ? "Processing..." : "Pay One-time $5.00"}
        </button>

        <div className="text-center pt-2">
          <span className="text-[10px] text-purple-400 uppercase font-bold tracking-widest block mb-1">
            Stripe Testing Assist
          </span>
          <p className="text-zinc-500 text-[11px] mb-3 max-w-xs mx-auto">
            Sandbox mode: type{" "}
            <span className="text-zinc-300 font-mono">4242 4242 4242 4242</span>, any future
            expiry, any CVC into the card field above — then submit below.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-cyan-500 text-neutral-950 hover:bg-cyan-400 active:scale-[0.98] transition-all text-sm shadow-lg disabled:opacity-50"
          >
            Simulate $5 Test Checkout
          </button>
        </div>
      </div>
    </form>
  );
}

function PaymentContent() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/payment", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          toast.error("Stripe configuration error. Check your server keys.");
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12 flex flex-col items-center gap-2">
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 text-2xl mb-2">
          <HiSparkles />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Upgrade Your Account</h1>
        <p className="text-zinc-400 text-sm max-w-md">
          Unlock premium prompt engineering templates and advanced assets
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        <div className="bg-[#0d0d1a] border border-zinc-850 rounded-2xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-[10px] uppercase tracking-wider bg-cyan-500/10 text-cyan-400 font-bold px-2.5 py-1 rounded-full border border-cyan-500/20">
              Lifetime Plan
            </span>
            <h2 className="text-2xl font-bold mt-4">Aiverse Pro Access</h2>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-4xl font-extrabold">$5.00</span>
              <span className="text-zinc-500 text-sm">/one-time</span>
            </div>

            <ul className="mt-8 space-y-3.5 text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <HiCheckCircle className="text-cyan-400 text-lg shrink-0 mt-0.5" />
                <span>Unlock all locked Private/Premium prompts</span>
              </li>
              <li className="flex items-start gap-3">
                <HiCheckCircle className="text-cyan-400 text-lg shrink-0 mt-0.5" />
                <span>Unlimited copy-to-clipboard actions</span>
              </li>
              <li className="flex items-start gap-3">
                <HiCheckCircle className="text-cyan-400 text-lg shrink-0 mt-0.5" />
                <span>Engage with rating and feedback reviews</span>
              </li>
              <li className="flex items-start gap-3">
                <HiCheckCircle className="text-cyan-400 text-lg shrink-0 mt-0.5" />
                <span>Priority access to future AI engine configurations</span>
              </li>
              <li className="flex items-start gap-3">
                <HiCheckCircle className="text-cyan-400 text-lg shrink-0 mt-0.5" />
                <span>One-time payment, lifetime ownership</span>
              </li>
            </ul>
          </div>
          <p className="text-[11px] text-zinc-500 mt-8 pt-4 border-t border-zinc-800/40">
            🛡️ Payments secured and encrypted via Stripe Gateway.
          </p>
        </div>

        <div className="bg-[#0d0d1a] border border-zinc-850 rounded-2xl p-8 shadow-xl min-h-[420px] flex flex-col justify-center">
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm clientSecret={clientSecret} />
            </Elements>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-zinc-500 text-sm">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              Loading Secure Payment Gateway...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080810] flex items-center justify-center text-white">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}