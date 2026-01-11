import { EmailTemplate } from "@/app/email/email-template";
import { Resend } from "resend";
import { formSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Form submission received:", body);

    const { captchaToken, ...formData } = body;

    if (!captchaToken) {
      return NextResponse.json(
        { error: "Captcha token is missing" },
        { status: 400 }
      );
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY!;
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${captchaToken}`,
      }
    );

    const verifyData = await verifyRes.json();

    console.log("reCAPTCHA verification response:", verifyData);

    if (!verifyData.success) {
      return NextResponse.json(
        { error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    const validatedData = formSchema.parse(formData);

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
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
