import userStatus from "@/actions/users";
import { createClient, getUser } from "@/app/utils/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const { status } = await userStatus();

  if (status === "approved") {
    redirect("/dashboard");
  } else if (status === "rejected") {
    redirect("/rejected");
  }
  return (
    <div className="mt-5 flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle
              className="text-4xl text-[#157A4E]"
              style={{ fontSize: "clamp(1.75rem, 0.5rem + 3vw, 3rem)" }}
            >
              your application has been submitted
            </CardTitle>
            <p className="m-auto max-w-lg">
              We'll email you when your application is approved. In the
              meantime, you can browse upcoming events.
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <p className="rounded-full bg-[#483F2C] px-3 py-2 text-[#FFD659]">
              Pending review
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Link href="/events">
              <Button className="max-w-[200px]">Browse upcoming events</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-[200px] max-w-[200px]">
                Return home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
