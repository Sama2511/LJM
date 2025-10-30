import { EmailTemplate } from "@/app/email/email-template";
import { Resend } from "resend";
import { formSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("📦 Received body:", body);

    const validatedData = formSchema.parse(body);
    // console.log("✅ Validated data:", validatedData);

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [process.env.RESEND_TO_EMAIL!],
      replyTo: validatedData.email,
      subject: `New Contact Form Message from ${validatedData.firstname} ${validatedData.lastname}`,
      react: EmailTemplate({
        firstname: validatedData.firstname,
        lastname: validatedData.lastname,
        email: validatedData.email,
        message: validatedData.message,
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    // console.error("❌ Send route error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
