"use client"

import React, { useState, useTransition } from 'react';
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as z from "zod";
import { Eye, EyeOff, Sprout, Leaf, ArrowRight } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { RegisterUserSchema, Role } from "@/validaton-schema";
import { registerUser } from "@/actions/registerUser";
import MainButton from "@/components/common/MainButton";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

const FormSchema = RegisterUserSchema;

type RegisterFormProps = {
  text: string;
  role: Role;
};

const RegisterForm = ({ text, role }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: "STARTUP",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (role) {
      data.role = role;
    }

    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      registerUser(data)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            toast({
              title: "🌱 Welcome to VentureHub!",
              description: data.success,
            });
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1A362B]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#EFEBE3] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-3xl">
          <div className="absolute top-20 right-20 w-32 h-32 border-2 border-[#1A362B]/10 rounded-full" />
          <div className="absolute bottom-20 left-20 w-40 h-40 border-2 border-[#EFEBE3] rounded-full" />
        </div>
        
        {/* Organic pattern */}
        <svg className="absolute bottom-0 left-0 w-full h-auto opacity-5" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C150,0 250,200 400,100 L400,200 L0,200 Z" fill="#1A362B" />
        </svg>
      </div>

      {/* Main Register Card */}
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

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-[#1A362B]/10 border border-[#EFEBE3] p-8 sm:p-10 reveal" style={{ animationDelay: "0.2s" }}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1A362B]/5 rounded-full mb-4">
              <Sprout className="w-8 h-8 text-[#1A362B]" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A362B] mb-2">
              Begin Your Journey
            </h1>
            <p className="text-[#1A362B]/60 text-sm">
              {text}
            </p>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-[#1A362B]/10" />
            <Leaf className="w-4 h-4 text-[#1A362B]/30" />
            <div className="flex-1 h-px bg-[#1A362B]/10" />
          </div>

          {/* Registration Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-[#1A362B]/80 mb-2">
                      Full Name
                    </label>
                    <FormControl>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A362B]/40 group-focus-within:text-[#1A362B] transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </div>
                        <Input
                          {...field}
                          className="h-12 pl-10 w-full rounded-lg border-[#1A362B]/20 bg-white/50 focus:ring-2 focus:ring-[#1A362B] focus:border-transparent text-[#1A362B] placeholder:text-[#1A362B]/30"
                          placeholder="John Smith"
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 mt-1" />
                  </FormItem>
                )}
              />

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
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A362B]/40 group-focus-within:text-[#1A362B] transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7L10.94 12.3375C11.5885 12.8208 12.4115 12.8208 13.06 12.3375L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </div>
                        <Input
                          {...field}
                          className="h-12 pl-10 w-full rounded-lg border-[#1A362B]/20 bg-white/50 focus:ring-2 focus:ring-[#1A362B] focus:border-transparent text-[#1A362B] placeholder:text-[#1A362B]/30"
                          placeholder="founder@example.com"
                          type="email"
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              {/* Mobile Field */}
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-sm font-medium text-[#1A362B]/80 mb-2">
                      Phone Number
                    </label>
                    <FormControl>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A362B]/40 group-focus-within:text-[#1A362B] transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <Input
                          {...field}
                          className="h-12 pl-10 w-full rounded-lg border-[#1A362B]/20 bg-white/50 focus:ring-2 focus:ring-[#1A362B] focus:border-transparent text-[#1A362B] placeholder:text-[#1A362B]/30"
                          placeholder="+1 (555) 000-0000"
                          disabled={isPending}
                        />
                      </div>
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
                    <label className="block text-sm font-medium text-[#1A362B]/80 mb-2">
                      Password
                    </label>
                    <FormControl>
                      <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A362B]/40 group-focus-within:text-[#1A362B] transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </div>
                        <Input
                          {...field}
                          className="h-12 pl-10 pr-10 w-full rounded-lg border-[#1A362B]/20 bg-white/50 focus:ring-2 focus:ring-[#1A362B] focus:border-transparent text-[#1A362B] placeholder:text-[#1A362B]/30"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isPending}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A362B]/40 hover:text-[#1A362B] transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              {/* Password Requirements Hint */}
              <div className="text-xs text-[#1A362B]/40 px-2">
                Password must be at least 8 characters long
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-2 px-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-[#1A362B]/20 text-[#1A362B] focus:ring-[#1A362B] bg-white/50"
                />
                <label htmlFor="terms" className="text-xs text-[#1A362B]/60">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#1A362B] underline underline-offset-2 hover:text-[#1A362B]/80">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#1A362B] underline underline-offset-2 hover:text-[#1A362B]/80">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Error & Success Messages */}
              <FormError message={error} />
              <FormSuccess message={success} />

              {/* Submit Button */}
              <MainButton
                text={isPending ? "Creating Account..." : "Create Account"}
                classes="w-full h-12 bg-[#1A362B] text-white rounded-lg font-bold uppercase text-xs tracking-[0.2em] hover:bg-[#1A362B]/90 transition-all duration-300 shadow-lg shadow-[#1A362B]/20"
                width="full_width"
                isSubmitable
                isLoading={isPending}
               
              />

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-[#1A362B]/60">
                  Already have an account?{" "}
                  <Link 
                    href="/auth/login" 
                    className="text-[#1A362B] font-medium hover:text-[#1A362B]/80 transition-colors underline underline-offset-4"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </Form>

          {/* Value Proposition */}
          <div className="mt-8 pt-6 border-t border-[#1A362B]/10">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="block font-serif text-xl text-[#1A362B]">$42M+</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#1A362B]/30">Capital Deployed</span>
              </div>
              <div>
                <span className="block font-serif text-xl text-[#1A362B]">240%</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-[#1A362B]/30">Avg. Growth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-[#1A362B]/30">
            <Link href="/about" className="hover:text-[#1A362B]/50 transition-colors">
              Mission
            </Link>
            <span>•</span>
            <Link href="/journal" className="hover:text-[#1A362B]/50 transition-colors">
              Journal
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
};

export default RegisterForm;