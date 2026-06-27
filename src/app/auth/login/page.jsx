"use client";

import { authClient } from "@/lib/auth-client";
import {
  Button,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Surface,
  TextField,
  Link,
} from "@heroui/react";
import React from "react";
import { FcGoogle } from "react-icons/fc"; 
import { FiLogIn } from "react-icons/fi"; 
import toast from "react-hot-toast";

export default function SignInPage() {
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { error } = await authClient.signIn.email({
      ...user,
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } else {
      toast.success("Welcome back!");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", 
    });

    if (error) {
      toast.error(error.message || "Google sign-in failed.");
    }
  };

 
  const inputStyles = {
    inputWrapper: [
      "bg-[#0f111a]",          
      "border border-purple-950/40",     
      "hover:border-purple-900/40",
      "focus-within:!border-purple-500/50", 
      "data-[hover=true]:bg-[#0f111a]",
      "group-data-[focus=true]:bg-[#0f111a]",
      "transition-all",
      "h-12",                  
    ].join(" "),
    input: "text-white placeholder:text-gray-600 text-[15px]",
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-220px)] py-12 dark bg-[#080810]">
      {/* 🔮 ব্যাকগ্রাউন্ড গ্লো */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md mx-auto rounded-3xl bg-zinc-900/20 backdrop-blur-xl border border-purple-950/30 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative z-10">
        <Surface className="w-full bg-transparent">
          <Form onSubmit={onSubmit} className="space-y-6">
            <Fieldset className="w-full space-y-5">
              
              <div className="text-center w-full flex flex-col items-center justify-center mb-2">
                <Fieldset.Legend className="text-3xl font-black text-white block w-full text-center tracking-tight">
                  Welcome Back
                </Fieldset.Legend>
                <Description className="text-zinc-500 text-xs mt-1 block">
                  Login to search, copy, and manage premium prompts
                </Description>
              </div>

              <div className="space-y-5">
                <TextField className="flex flex-col gap-1.5">
                  <Label className="text-[10px] font-black text-purple-400 tracking-widest uppercase">Email Address</Label>
                  <Input isRequired name="email" type="email" placeholder="you@example.com" variant="flat" classNames={inputStyles} />
                  <FieldError className="text-rose-400 text-xs mt-1" />
                </TextField>

                <TextField className="flex flex-col gap-1.5">
                  <Label className="text-[10px] font-black text-purple-400 tracking-widest uppercase">Password</Label>
                  <Input isRequired name="password" type="password" placeholder="••••••••" variant="flat" classNames={inputStyles} />
                  <FieldError className="text-rose-400 text-xs mt-1" />
                </TextField>
              </div>

              {/* 🎯 লগইন বাটন থিম কালার */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white h-12 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.25)] hover:opacity-95 transition-all flex items-center justify-center gap-2 text-sm mt-6 cursor-pointer"
              >
                <FiLogIn className="text-base" /> Log In
              </Button>
            </Fieldset>
          </Form>

          {/* 🔗 সোশ্যাল মিডিয়া পার্ট */}
          <div className="mt-6 space-y-5">
            <div className="flex items-center">
              <div className="flex-grow border-t border-purple-950/20"></div>
              <span className="px-3 text-[10px] text-zinc-500 font-bold uppercase tracking-widest whitespace-nowrap">
                or continue with
              </span>
              <div className="flex-grow border-t border-purple-950/20"></div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="bordered"
              className="w-full border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-300 hover:text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <FcGoogle className="text-xl" />
              Sign In with Google
            </Button>

            <div className="text-center text-xs text-zinc-500 font-medium">
              Don't have an account?{" "}
              <Link 
                href="/auth/register"
                className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-black ml-1 uppercase text-[11px] tracking-wider"
              >
                Register here
              </Link>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
}