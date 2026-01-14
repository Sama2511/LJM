import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { captchaToken } = await req.json();

  if (!captchaToken) {
    return NextResponse.json(
      { error: "Captcha missing" },
      { status: 400 }
    );
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY!;
  const verifyRes = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${captchaToken}`,
    }
  );

  const data = await verifyRes.json();

  if (!data.success) {
    return NextResponse.json(
      { error: "Captcha failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
