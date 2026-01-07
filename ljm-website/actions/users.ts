"use server";

import { createClient, getUser } from "@/app/utils/server";
import { signUpSchema, volunteerForm } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signup(formData: z.infer<typeof signUpSchema>) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email as string,
    password: formData.password as string,
    options: {
      data: {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
      },
    },
  });

  if (error) {
    redirect("/error");
  }
  if (!error) {
    console.log("user auth created with metadata");
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
    redirect("/error");
  }

  console.log("Volunteer form submitted successfully");

  const { data, error: updateError } = await supabase
    .from("users")
    .update({ formcompleted: true })
    .eq("id", user.id)
    .select();

  console.log(`form completed was modified to true: ${data}`);
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
