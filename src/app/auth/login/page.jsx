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
      "border-transparent",     
      "hover:border-transparent",
      "focus-within:!border-orange-500/50", 
      "data-[hover=true]:bg-[#0f111a]",
      "group-data-[focus=true]:bg-[#0f111a]",
      "transition-colors",
      "h-12",                  
    ].join(" "),
    input: "text-white placeholder:text-gray-600 text-[15px]",
  };

  return (
    <div 
      className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-220px)] py-12 dark"
      style={{ backgroundColor: "#0b0813" }}
    >
      <div className="w-full max-w-md mx-auto rounded-3xl bg-[#0b0813]/70 backdrop-blur-md border border-purple-950/30 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <Surface className="w-full bg-transparent">
          <Form onSubmit={onSubmit} className="space-y-6">
            <Fieldset className="w-full space-y-5">
              
              <div className="text-center w-full flex flex-col items-center justify-center mb-2">
                <Fieldset.Legend className="text-3xl font-black text-white block w-full text-center tracking-tight">
                  Welcome Back
                </Fieldset.Legend>
                <Description className="text-zinc-400 text-sm mt-1 block">
                  Login to search, copy, and manage premium prompts
                </Description>
              </div>

              <div className="space-y-5">
                <TextField isRequired name="email" type="email" className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                    Email Address
                  </Label>
                  <Input 
                    placeholder="you@example.com" 
                    variant="flat"
                    classNames={inputStyles}
                  />
                  <FieldError />
                </TextField>

                <TextField isRequired name="password" type="password" className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                    Password
                  </Label>
                  <Input 
                    placeholder="••••••••" 
                    variant="flat"
                    classNames={inputStyles}
                  />
                  <FieldError />
                </TextField>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white h-12 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:opacity-95 transition-all flex items-center justify-center gap-2 text-[15px] mt-6"
              >
                <FiLogIn className="text-lg" /> Log In
              </Button>
            </Fieldset>
          </Form>

          <div className="mt-6 space-y-6">
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-zinc-800/60"></div>
              <span className="px-3 text-xs text-zinc-500 font-medium whitespace-nowrap uppercase tracking-wider">
                or continue with
              </span>
              <div className="flex-grow border-t border-zinc-800/60"></div>
            </div>

            
            <Button
              onClick={handleGoogleSignIn}
              variant="bordered"
              className="w-full border-zinc-800 bg-zinc-900/40 text-white font-medium h-12 rounded-xl transition-all hover:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-2 text-[15px]"
            >
              <FcGoogle className="text-xl" />
              Sign In with Google
            </Button>

            <div className="text-center text-sm text-zinc-400 mt-5">
              Don't have an account?{" "}
              <Link 
                href="/auth/register"
                className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent font-bold transition-colors ml-1"
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