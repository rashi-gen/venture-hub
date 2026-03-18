// actions/initiatePasswordReset.ts
"use server";

import { sendEmail } from "@/lib/mailer";
import { generatePasswordResetToken } from "@/lib/token";
import { z } from "zod";
import { findUserByEmail } from "./user";
import { ForgotPasswordSchema } from "@/validaton-schema";

// ── Email template ─────────────────────────────────────────────────────────
function buildPasswordResetEmail(name: string, resetUrl: string) {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#F9F7F2;border-radius:16px;overflow:hidden;">
      <div style="background:#1A362B;padding:32px 36px;">
        <h1 style="margin:0;font-size:22px;color:#F9F7F2;font-weight:700;letter-spacing:-0.3px;">VentureHub</h1>
        <p style="margin:6px 0 0;font-size:13px;color:rgba(249,247,242,0.55);">Startup Ecosystem Platform</p>
      </div>
      <div style="padding:36px;">
        <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1A362B;">Reset your password</p>
        <p style="margin:0 0 24px;font-size:15px;color:#4A5D4E;line-height:1.65;">
          Hi ${name}, we received a request to reset the password for your VentureHub account.
          Click the button below to choose a new password.
        </p>

        <a href="${resetUrl}"
          style="display:inline-block;background:#1A362B;color:#F9F7F2;text-decoration:none;
                 padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;letter-spacing:0.02em;">
          Reset My Password →
        </a>

        <!-- Security notice -->
        <div style="background:#EFEBE3;border-radius:10px;padding:16px 20px;margin-top:28px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;
                     letter-spacing:0.1em;color:#4A5D4E;">Security notice</p>
          <p style="margin:0;font-size:13px;color:#2D2D2D;line-height:1.5;">
            This link expires in <strong>1 hour</strong>. If you didn't request a password reset,
            your account is safe — you can ignore this email. Someone may have entered your email address by mistake.
          </p>
        </div>

        <p style="margin:20px 0 0;font-size:11px;color:#9ca3af;">
          Or copy this URL: <span style="color:#1A362B;">${resetUrl}</span>
        </p>
      </div>
      <div style="padding:20px 36px;border-top:1px solid #EFEBE3;">
        <p style="margin:0;font-size:11px;color:#9ca3af;">© ${new Date().getFullYear()} VentureHub · venturehub.io</p>
      </div>
    </div>
  `;
}

// ── Action ─────────────────────────────────────────────────────────────────
export async function initiatePasswordReset(
  values: z.infer<typeof ForgotPasswordSchema>
) {
  const validation = ForgotPasswordSchema.safeParse(values);
  if (!validation.success) {
    return { error: "Invalid email!" } as const;
  }

  const { email } = validation.data;

  const existingUser = await findUserByEmail(email);
  if (!existingUser) {
    return { error: "Email not found!" } as const;
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  if (passwordResetToken) {
    const base = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_RESET_PASSWORD_ENDPOINT}`;
    const url  = `${base}?token=${passwordResetToken.token}`;

    await sendEmail(
      "VentureHub",
      passwordResetToken.email,
      "Reset your VentureHub password",
      buildPasswordResetEmail(existingUser.name ?? "there", url)
    );

    return { success: "Password reset email sent! Check your inbox." } as const;
  }

  return { error: "Failed to generate reset token. Please try again." } as const;
}