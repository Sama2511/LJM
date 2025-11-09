import userStatus from "@/actions/users";
import { createClient, getUser } from "@/app/utils/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const user = await getUser();

  if (user) {
    const supabase = await createClient();

    const { data: userData } = await supabase
      .from("users")
      .select("formcompleted")
      .eq("id", user.id)
      .single();

    if (!userData?.formcompleted) {
      redirect("/volunteerForm");
    }

    const { status, error } = await userStatus();

    if (status === "pending") {
      redirect("/confirmation");
    } else if (status === "approved") {
      redirect("/dashboard/logged");
    } else if (status === "rejected") {
      redirect("/rejected");
    }
  }
  return (
    <>
      <div className="flex h-screen flex-col items-center gap-2">
        <div className="w-[90%]">
          <h1 className="text-foreground mt-15 text-center font-serif text-3xl font-bold lg:text-4xl">
            Welcome to the volunteer Portal
          </h1>
          <p className="mt-2 text-center">
            Join our community of compassionate volunteers making a difference
            in end-of-life care.
          </p>
        </div>
        <Card className="bg-muted mt-10 flex w-[90%] max-w-3xl text-center drop-shadow-xl">
          <CardHeader>
            <CardTitle className="text-foreground text-2xl">
              Sign in to continue
            </CardTitle>
            <CardDescription>
              Access your volunteer dashboard and manage your commitments
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <Button>
              <Link href="/login">Sign in to the Crew Portal</Link>{" "}
            </Button>
            <CardAction className="m-auto mt-2 flex gap-2 text-sm text-[12px]">
              <p>New Member ?</p>
              <Link href="/sign-up" className="text-[#157A4E]">
                Create an account
              </Link>
            </CardAction>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
