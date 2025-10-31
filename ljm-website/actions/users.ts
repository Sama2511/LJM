"use server";

import { createClient } from "@/app/utils/server";
import { signUpSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { email, z } from "zod";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

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
  }

  const { error: dberror } = await supabase.from("users").insert({
    id: data?.user?.id,
    firstname: formData.firstname,
    lastname: formData.lastname,
    phonenumber: formData.phoneNumber,
    formcompleted: false,
  });
  if (!dberror) {
    console.log("user added to table");
  }
  if (dberror) {
    console.log(dberror);
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/check-email");
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
