"use server";

import { createClient, getUser } from "@/app/utils/server";
import { signUpSchema, volunteerForm } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signup(formData: z.infer<typeof signUpSchema>) {
  const supabase = await createClient();

  const userInfo = {
    email: formData.email as string,
    password: formData.password as string,
  };

  const { data, error } = await supabase.auth.signUp(userInfo);

  if (error) {
    redirect("/error");
  }
  if (!error) {
    console.log("user auth created");

    const { error: dberror } = await supabase.from("users").insert({
      id: data?.user?.id,
      firstname: formData.firstname,
      lastname: formData.lastname,
      formcompleted: false,
    });
    if (!dberror) {
      console.log("user added to table");
    }
    if (dberror) {
      console.log(`this is the an insert error: ${dberror.message}`);
      redirect("/error");
    }
    revalidatePath("/", "layout");
    redirect("/check-email");
  }
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function volunteerSubmit(formData: z.infer<typeof volunteerForm>) {
  const supabase = await createClient();
  const user = await getUser();
  console.log(user?.id);
  if (!user) {
    redirect("/error");
  }

  const { error: insertError } = await supabase.from("volunteer_form").insert({
    id: user.id,
    activities: formData.activities,
    inspiration: formData.inspiration,
    skills: formData.skills,
    interests: formData.interests,
    story: formData.story,
    certificate: formData.certificate,
    availability: formData.availability,
  });

  if (insertError) {
    console.error("Insert error:", insertError.message);
    redirect("/error");
  }

  console.log("Volunteer form submitted successfully");

  const { error: updateError } = await supabase
    .from("users")
    .update({ formcompleted: true })
    .eq("id", user.id);

  if (updateError) {
    console.error("Update error:", updateError.message);
    redirect("/error");
  }

  redirect("/confirmation");
}
export default async function userStatus() {
  const supabase = await createClient();
  const user = await getUser();
  const { data, error } = await supabase
    .from("volunteer_form")
    .select("status")
    .eq("id", user?.id)
    .single();

  // if (error) {
  //   redirect("/error");
  // }
  return { status: data?.status, error };
}
