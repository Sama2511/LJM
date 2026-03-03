import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/app/utils/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error: dberror } = await supabase.from("users").insert({
          id: user.id,
          firstname: user.user_metadata.firstname,
          lastname: user.user_metadata.lastname,
          email: user.user_metadata.email,
          formcompleted: false,
        });

        if (dberror) {
          console.log(`Insert error: ${dberror.message}`);
          return NextResponse.redirect(`${origin}/error`);
        }
      }

      return NextResponse.redirect(`${origin}/volunteerForm`);
    }
  }

  return NextResponse.redirect(`${origin}/error`);
}
