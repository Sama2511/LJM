"use client";

import { signup } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

export default function page() {
  const signupForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  async function handleSignupWithCaptcha(data: z.infer<typeof signUpSchema>) {
    try {
      const result = await signup(data);

      if (result.success) {
        toast.success("Signup successful! Please check your email.");
        window.location.href = "/check-email";
      } else {
        toast.error(`Signup failed: ${result.error}`);
        console.error("Signup error:", result.error);
      }
    } catch (error: any) {
      toast.error(`Signup failed: ${error.message || error}`);
      console.error("Signup failed:", error);
    }
  }

  return (
    <div className="mt-5 flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="mx-w-[300px] bg-muted">
          <CardContent>
            <form
              id="signupForm"
              onSubmit={signupForm.handleSubmit(handleSignupWithCaptcha)}
            >
              <FieldGroup>
                <Controller
                  name="firstname"
                  control={signupForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        First Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="firstname"
                        aria-invalid={fieldState.invalid}
                        placeholder="First Name"
                        autoComplete="given-name"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="lastname"
                  control={signupForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        Last Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="lastname"
                        aria-invalid={fieldState.invalid}
                        placeholder="Last Name"
                        autoComplete="additional-name"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={signupForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="email"
                        autoComplete="email"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={signupForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter Password"
                        type="password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="repeatPassword"
                  control={signupForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="repeatPassword"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Repeat Password"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />


              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter>
            <Field
              orientation="responsive"
              className="flex flex-col items-center justify-between"
            >
              <Button type="submit" form="signupForm">
                {signupForm.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
