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
  ListBox,
  Select,
  TextField,
  Link,
} from "@heroui/react";
import { useRouter } from "next/navigation"; 
import React from "react";
import { FcGoogle } from "react-icons/fc"; 

export default function SignUpPage() {
  const router = useRouter(); 

 
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: user.image || undefined,
      
      data: {
        role: user.role || "user",
        plan: "free",
      }
    });

    router.push("/"); 
  };

 
  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", 
    });
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
      style={{ backgroundColor: "rgba(11, 8, 19, 0.7)" }} 
    >
      <div className="w-full max-w-xl mx-auto rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <Surface className="w-full bg-transparent">
          <Form onSubmit={onSubmit} className="space-y-6">
            <Fieldset className="w-full space-y-5">
              
              <div className="text-center w-full mb-2">
                <Fieldset.Legend className="text-3xl font-black text-white block w-full text-center tracking-tight">
                  Register
                </Fieldset.Legend>
                <Description className="text-zinc-400 text-sm mt-1 block">
                  Join the universe of AI prompts and maximize your creativity
                </Description>
              </div>

              <div className="space-y-5">
                <TextField isRequired name="name" className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                    Name
                  </Label>
                  <Input 
                    placeholder="John Doe" 
                    variant="flat"
                    classNames={inputStyles}
                  />
                  <FieldError />
                </TextField>

                <TextField name="image" type="url" className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                    Image URL
                  </Label>
                  <Input 
                    placeholder="Image URL" 
                    variant="flat"
                    classNames={inputStyles}
                  />
                  <FieldError />
                </TextField>

                <TextField isRequired name="email" type="email" className="flex flex-col gap-2">
                  <Label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                    Email Address
                  </Label>
                  <Input 
                    placeholder="john@example.com" 
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
                    placeholder="Password" 
                    variant="flat"
                    classNames={inputStyles}
                  />
                  <FieldError />
                </TextField>

                <Select 
                  isRequired 
                  name="role" 
                  placeholder="Select one"
                  variant="flat"
                  classNames={{
                    trigger: "bg-[#0f111a] border-transparent text-white hover:border-transparent data-[hover=true]:bg-[#0f111a] h-12 rounded-xl",
                    value: "text-white text-[15px]",
                    label: "text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-2",
                    popoverContent: "bg-[#0b0813] border border-white/[0.1]"
                  }}
                >
                  <Label>Signup As</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox className="text-white">
                      <ListBox.Item id="user" textValue="user" className="hover:bg-orange-500/20 data-[hover=true]:bg-orange-500/20">
                        User
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="creator" textValue="creator" className="hover:bg-orange-500/20 data-[hover=true]:bg-orange-500/20">
                        Creator
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white py-2.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:opacity-90 transition-all mt-6"
              >
                Signup
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
              onClick={handleGoogleSignUp}
              variant="bordered"
              className="w-full border-zinc-800 bg-zinc-900/40 text-white font-semibold py-2.5 rounded-xl bg-transparent hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" />
              Sign Up with Google
            </Button>

            <div className="text-center text-sm text-zinc-400 mt-4">
              Already have an account?{" "}
              <Link 
                href="/auth/login" 
                className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent font-bold transition-colors ml-1"
              >
                Log in here
              </Link>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
}