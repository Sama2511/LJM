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
import React from "react";

export default function page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-[90%]">
          <h1 className="mt-15 text-center font-serif text-3xl font-bold text-[#157A4E] lg:text-4xl">
            Welcome to the volunteer Portal
          </h1>
          <p className="mt-2 text-center">
            Join our community of compassionate volunteers making a difference
            in end-of-life care.
          </p>
        </div>
        <Card className="mt-10 flex w-[90%] max-w-3xl text-center drop-shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Sign in to continue</CardTitle>
            <CardDescription>
              Access your volunteer dashboard and manage your commitments
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <Button> Sign in to the Crew Portal</Button>
            <CardAction className="m-auto mt-2 text-sm">
              New Member?
              <Link href="/sign-up" className="text-[#157A4E]">
                {" "}
                Create an account
              </Link>
            </CardAction>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
