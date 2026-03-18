"use client";

import { EyeOff, Eye, Sprout } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../ui/button";
import Image from "next/image";
import { loginUser } from "@/actions/loginUser";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import { LoginSchema } from "@/validaton-schema";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [error, setError] = useState<string | undefined>(undefined);
  const [isRedirecting, setIsRedirecting] = useState<boolean | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    if (isPending || isRedirecting) return;

    setError(undefined);
    setSuccess(undefined);

    try {
      startTransition(async () => {
        const result = await loginUser(data);
        
        if (result?.error) {
          setError(result.error);
          return;
        }

        if (result?.success) {
          setSuccess(result.success);
          
          if (result.redirectTo) {
            setIsRedirecting(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = result.redirectTo;
          }
        }
      });
    } catch (e) {
      console.error("Login error:", e);
      setError("Authentication failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
     

      {/* Main Login Card */}
      <div className="w-full max-w-md relative">
        {/* Brand Logo Area */}
        <div className="text-center mb-8 reveal">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 bg-[#1A362B] rounded-sm flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
              <div className="w-7 h-7 border-2 border-[#F9F7F2] rotate-45" />
            </div>
            <div className="text-left">
              <span className="font-serif text-2xl font-bold text-[#1A362B] block leading-tight">
                VentureHub
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#1A362B]/40 font-bold">
                Nurturing Growth
              </span>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-[#1A362B]/10 border border-[#EFEBE3] p-8 sm:p-10 reveal" style={{ animationDelay: "0.2s" }}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A362B] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#1A362B]/60 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-[#1A362B]/10" />
            <Sprout className="w-4 h-4 text-[#1A362B]/30" />
            <div className="flex-1 h-px bg-[#1A362B]/10" />
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-[#1A362B]/80 mb-2">
                      Email Address
                    </label>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="founder@venturehub.com"
                        className="h-12 bg-white/50 border-[#1A362B]/20 rounded-lg focus:ring-2 focus:ring-[#1A362B] focus:border-transparent placeholder:text-[#1A362B]/30 text-[#1A362B]"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-[#1A362B]/80">
                        Password
                      </label>
                      <Link 
                        href="/auth/forgot-password"
                        className="text-xs text-[#1A362B]/60 hover:text-[#1A362B] transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="••••••••"
                          className="h-12 bg-white/50 border-[#1A362B]/20 rounded-lg focus:ring-2 focus:ring-[#1A362B] focus:border-transparent pr-12 text-[#1A362B]"
                          type={showPassword ? "text" : "password"}
                          disabled={isPending}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A362B]/40 hover:text-[#1A362B] transition-colors"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage className="text-sm text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-[#1A362B]/20 text-[#1A362B] focus:ring-[#1A362B] bg-white/50"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-[#1A362B]/70">
                  Remember this device
                </label>
              </div>

              {/* Error & Success Messages */}
              <FormError message={error} />
              <FormSuccess message={success} />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-[#1A362B] text-white rounded-lg font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#1A362B]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Login to VentureHub</span>
                      <Sprout className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              {/* Register Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-[#1A362B]/60">
                  Don't have an account?{" "}
                  <Link 
                    href="/auth/register" 
                    className="text-[#1A362B] font-medium hover:text-[#1A362B]/80 transition-colors underline underline-offset-4"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          </Form>

          {/* Testimonial Quote */}
          <div className="mt-8 pt-6 border-t border-[#1A362B]/10 text-center">
            <p className="text-xs text-[#1A362B]/40 italic">
              "Joining VentureHub transformed how we approach growth."
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A362B]/30 mt-2">
              — Elara Vance, Aeris Bio
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-[#1A362B]/30">
            <Link href="/privacy" className="hover:text-[#1A362B]/50 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#1A362B]/50 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#1A362B]/50 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;