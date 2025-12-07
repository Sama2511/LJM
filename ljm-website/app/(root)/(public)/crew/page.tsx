import userStatus from "@/actions/users";
import { createClient, getUser } from "@/app/utils/server";
import { redirect } from "next/navigation";
import React from "react";

import LoginForm from "@/components/LoginForm";

export default async function page() {
  const user = await getUser();

  if (user) {
    const supabase = await createClient();

    const { data: userData } = await supabase
      .from("users")
      .select("formcompleted")
      .eq("id", user.id)
      .single();

    console.log(userData?.formcompleted);
    if (userData?.formcompleted === false) {
      redirect("/volunteerForm");
    }
    console.log("status checked");

    const { status } = await userStatus();
    if (status === "pending") {
      redirect("/confirmation");
    } else if (status === "approved") {
      redirect("/dashboard");
    } else if (status === "rejected") {
      redirect("/rejected");
    }
  }

  return (
    <>
      <div className="flex h-screen flex-col items-center gap-2 py-10">
        <div className="w-[90%]">
          <h1 className="text-foreground mt-10 text-center font-serif text-3xl font-bold lg:text-4xl">
            Welcome to the volunteer Portal
          </h1>
          <p className="mt-2 text-center">
            Join our community of compassionate volunteers making a difference
            in end-of-life care.
          </p>
        </div>

        <div className="mt-1 flex w-[90%] max-w-3xl justify-center">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
