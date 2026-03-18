// actions/loginUser.ts
"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import * as z from "zod";
import { findUserByEmail } from "./user";
import { sendEmail } from "@/lib/mailer";
import { LoginSchema } from "@/validaton-schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { generateEmailVerificationToken } from "@/lib/token";

// ── Email template ─────────────────────────────────────────────────────────
function buildEmailVerificationEmail(name: string, activationUrl: string) {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;
                background:#F9F7F2;border-radius:16px;overflow:hidden;">
      <div style="background:#1A362B;padding:32px 36px;">
        <h1 style="margin:0;font-size:22px;color:#F9F7F2;font-weight:700;letter-spacing:-0.3px;">VentureHub</h1>
        <p style="margin:6px 0 0;font-size:13px;color:rgba(249,247,242,0.55);">Startup Ecosystem Platform</p>
      </div>
      <div style="padding:36px;">
        <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1A362B;">Verify your email</p>
        <p style="margin:0 0 24px;font-size:15px;color:#4A5D4E;line-height:1.65;">
          Hi ${name}, you recently tried to log in to VentureHub. Please verify your email address to continue.
        </p>
        <a href="${activationUrl}"
          style="display:inline-block;background:#1A362B;color:#F9F7F2;text-decoration:none;
                 padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;letter-spacing:0.02em;">
          Verify Email Address →
        </a>
        <p style="margin:20px 0 0;font-size:12px;color:#4A5D4E;line-height:1.5;">
          This link expires in <strong>24 hours</strong>.
        </p>
        <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">
          Or copy this URL: <span style="color:#1A362B;">${activationUrl}</span>
        </p>
      </div>
      <div style="padding:20px 36px;border-top:1px solid #EFEBE3;">
        <p style="margin:0;font-size:11px;color:#9ca3af;">© ${new Date().getFullYear()} VentureHub · venturehub.io</p>
      </div>
    </div>
  `;
}

// ── Action ─────────────────────────────────────────────────────────────────
export async function loginUser(values: z.infer<typeof LoginSchema>) {
  const validation = LoginSchema.safeParse(values);
  if (!validation.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validation.data;
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  // Email not verified — resend verification link
  if (!existingUser.emailVerified) {
    const verificationToken = await generateEmailVerificationToken(existingUser.email);
    if (verificationToken) {
      const base = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_ENDPOINT}`;
      const url  = `${base}?token=${verificationToken.token}`;
      await sendEmail(
        "VentureHub",
        verificationToken.email,
        "Verify your VentureHub email address",
        buildEmailVerificationEmail(existingUser.name ?? "there", url)
      );
      return { success: "Verification email sent! Please check your inbox." };
    }
  }

  try {
    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      return { error: "Invalid credentials!" };
    }

    // ── Forced password change on first login ────────────────────────────
    // Admin-created accounts have mustChangePassword = true.
    // Send them to /auth/change-password before they can use the platform.
    if (existingUser.mustChangePassword) {
      return {
        success:    "Login successful. Please set a new password to continue.",
        redirectTo: "/auth/change-password",
      };
    }

    return { success: "Logged in successfully!", redirectTo: DEFAULT_LOGIN_REDIRECT };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    return { error: "An unexpected error occurred." };
  }
}