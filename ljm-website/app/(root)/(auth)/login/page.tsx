"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export default function page() {
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  }

  return (
    <div className="m-auto w-[90%] max-w-[350px]">
      <div>
        <div className="mb-8 space-y-1">
          <h1 className="mt-15 font-serif text-3xl font-bold text-[#157A4E] lg:text-4xl">
            Hi,
            <br />
            Welcome Back
          </h1>
          <p>Welcome to your volunteer portal </p>
        </div>
        <div className="w-full max-w-md">
          <form id="login-form" onSubmit={submit}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Max Leiter"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                  />
                </Field>
                <FieldContent className="flex flex-row items-center">
                  <Checkbox id="Remember" name="Remember" />
                  <FieldLabel>Remember me</FieldLabel>
                </FieldContent>
              </FieldGroup>
              <FieldContent>
                <Button type="submit"> login</Button>
                <div className="m-auto mt-2 flex gap-2 text-sm text-[12px]">
                  <p>New Member ?</p>
                  <Link href="/sign-up" className="text-[#157A4E]">
                    Create an account
                  </Link>
                </div>
              </FieldContent>
            </FieldSet>
          </form>
        </div>
      </div>
    </div>
  );
}
