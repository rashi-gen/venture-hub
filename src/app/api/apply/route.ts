import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { StartupApplicationsTable } from "@/db/schema";
import { z } from "zod";
import { sendEmail } from "@/lib/mailer";
import { randomUUID } from "crypto";

// Validation schema matching your StartupApplicationsTable
const applicationSchema = z.object({
  // Founder Identity
  founderName: z.string().min(2, "Founder name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().optional(),
  
  // Core Concept
  companyName: z.string().min(2, "Company name is required"),
  sector: z.string().min(1, "Industry/Sector is required"),
  stage: z.enum(["IDEA", "PRE_SEED", "SEED", "SERIES_A", "SERIES_B", "SERIES_C", "GROWTH"]),
  country: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  
  // Pitch deck URL (mapped from form)
  pitchDeckUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = applicationSchema.parse(body);
    
    // Check if application with this email already exists
    const existingApplication = await db.query.StartupApplicationsTable.findFirst({
      where: (applications, { eq }) => eq(applications.email, validatedData.email)
    });

    if (existingApplication) {
      return NextResponse.json(
        { 
          error: "An application with this email already exists",
          code: "DUPLICATE_EMAIL"
        },
        { status: 409 }
      );
    }

    // Create application in database
    const [application] = await db.insert(StartupApplicationsTable)
      .values({
        id: randomUUID(),
        ...validatedData,
        status: "SUBMITTED",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Send confirmation email using nodemailer
    try {
      const applicationStatusUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/apply/status?email=${encodeURIComponent(validatedData.email)}`;
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Application Received</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #1a3f34; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              h1 { margin: 0; font-size: 28px; font-weight: 300; }
              h2 { color: #1a3f34; font-size: 22px; margin-top: 0; }
              .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a3f34; }
              .button { display: inline-block; background: #1a3f34; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
              .footer { margin-top: 30px; font-size: 14px; color: #666; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>VentureHub</h1>
              </div>
              <div class="content">
                <h2>Application Received, ${validatedData.founderName}!</h2>
                
                <p>Thank you for applying to VentureHub with <strong>${validatedData.companyName}</strong>. Your application has been successfully received and is now in our review queue.</p>

                <div class="details">
                  <p style="margin-top: 0;"><strong>Application ID:</strong> ${application.id}</p>
                  <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
                  <p><strong>Status:</strong> Under Review</p>
                </div>

                <h3>Next Steps:</h3>
                <ol>
                  <li>Our team will review your application within 3-5 business days</li>
                  <li>You'll receive an email notification about the decision</li>
                  <li>If approved, you'll get access to complete your startup profile</li>
                </ol>

                <p>You can check your application status anytime by clicking the button below:</p>
                
                <a href="${applicationStatusUrl}" class="button">Check Application Status</a>

                <p style="margin-top: 30px;">In the meantime, if you have any questions, please don't hesitate to reach out to our team at <a href="mailto:applications@venturehub.com">applications@venturehub.com</a>.</p>

                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

                <p>
                  Best regards,<br />
                  <strong>The VentureHub Team</strong>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} VentureHub. All rights reserved.</p>
                <p>123 Innovation Drive, San Francisco, CA 94105</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await sendEmail(
        "VentureHub Applications",
        validatedData.email,
        "Your VentureHub application has been received",
        emailHtml
      );

    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Failed to send confirmation email:", emailError);
    }

    // Return success with application ID
    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: application.id,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// GET endpoint to check application status
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter required" },
      { status: 400 }
    );
  }

  try {
    const application = await db.query.StartupApplicationsTable.findFirst({
      where: (applications, { eq }) => eq(applications.email, email),
      columns: {
        id: true,
        status: true,
        createdAt: true,
        reviewedAt: true,
        reviewNotes: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Failed to check application status:", error);
    return NextResponse.json(
      { error: "Failed to check application status" },
      { status: 500 }
    );
  }
}