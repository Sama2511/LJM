"use client";

import React, { useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Loader2 } from "lucide-react";
import { formSchema } from "@/lib/schemas";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const token = await recaptchaRef.current?.executeAsync();
      if (!token) {
        toast.error("reCAPTCHA verification failed.");
        return;
      }

      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, captchaToken: token }),
      });

      if (!response.ok) {
        toast.error("Something went wrong");
        return;
      }

      toast.success("Your message has been sent");
      form.reset();
      recaptchaRef.current?.reset();
    } catch (error: any) {
      toast.error(`Something went wrong: ${error.message || error}`);
    }
  }

  return (
    <Card className="bg-muted m-auto mt-20 w-full sm:max-w-md">
      <CardContent>
        <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="firstname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="font-semibold text-black"
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
                    className="text-black placeholder-black"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="font-semibold text-black"
                    htmlFor="lastname"
                  >
                    Last Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="lastname"
                    aria-invalid={fieldState.invalid}
                    placeholder="Last Name"
                    autoComplete="family-name"
                    className="text-black placeholder-black"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="font-semibold text-black"
                    htmlFor="email"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="example@email.com"
                    autoComplete="email"
                    className="text-black placeholder-black"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="font-semibold text-black"
                    htmlFor="message"
                  >
                    Message
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="message"
                      placeholder="Leave us a message..."
                      rows={6}
                      className="min-h-24 resize-none text-black placeholder-black"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="text-[#ff8200] tabular-nums">
                        {field.value.length}/500 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              size="invisible"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="responsive">
          <Button
            type="submit"
            form="contact-form"
            disabled={form.formState.isSubmitting}
            className="bg-[#ff8200]"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" /> <p>Sending</p>
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
