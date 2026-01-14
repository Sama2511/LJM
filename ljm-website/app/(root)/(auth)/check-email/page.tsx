import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div className="bg-muted flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="max-w-[350px] text-center">
          <CardHeader className="space-y-2">
            <Mail className="m-auto text-foreground" size={40} />
            <h1 className="text-xl font-semibold">Check your email</h1>
            <p>
              We've sent a verification link to your email address. Click the
              link to verify your account and continue with your registration.
            </p>
          </CardHeader>
          <CardContent className="text-sm">
            Did you receive the email? if not, check your spam folder
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
