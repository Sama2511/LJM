import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

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
          phonenumber: user.user_metadata.phonenumber,
          formcompleted: false,
        });

        if (dberror) {
          console.log(`Insert error: ${dberror.message}`);
          redirect("/error");
        }

        console.log("User added to table after email confirmation");
      }

      redirect("/volunteerForm");
    }
  }

  redirect("/error");
}
