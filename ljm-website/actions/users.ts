"use server";

import { createClient, getUser } from "@/app/utils/server";
import { signUpSchema, volunteerForm } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signup(formData: z.infer<typeof signUpSchema>) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
      },
    },
  });

  if (error) {
    console.error("Signup failed:", error.message); // for console log
    return { success: false, error: error.message }; // return error to frontend
  }

  console.log("User auth created with metadata");
  return { success: true }; // return success to frontend
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

  if (!user) {
    return { success: false, error: "User not logged in" }; // <-- replace redirect
  }

  const { error: insertError } = await supabase.from("volunteer_form").insert({
    id: user.id,
    phone: formData.phone,
    emergency_contact: formData.emergencyContact,
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
    return { success: false, error: insertError.message }; // <-- replace redirect
  }

  const { data, error: updateError } = await supabase
    .from("users")
    .update({ formcompleted: true })
    .eq("id", user.id)
    .select();

  if (updateError) {
    console.error("Update error:", updateError.message);
    return { success: false, error: updateError.message }; // <-- replace redirect
  }

  return { success: true }; // everything okay
}


export default async function userStatus() {
  const supabase = await createClient();
  const user = await getUser();
  const { data, error } = await supabase
    .from("volunteer_form")
    .select("status")
    .eq("id", user?.id)
    .single();

  if (error) {
    redirect("/error");
  }
  return { status: data?.status, error };
}

export async function UserInfo() {
  const supabase = await createClient();
  const user = await getUser();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();
  if (error) {
    redirect("/error");
  }
  return { userData: data };
}
