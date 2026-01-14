"use client";
import React, { useRef } from "react";
import { volunteerForm } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { volunteerSubmit } from "@/actions/users";
import { Loader2 } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

export default function page() {
  const activityOptions = [
    "events",
    "gardening",
    "companionship",
    "transport",
    "kitchen-help",
    "administration",
  ] as const;

  const Form = useForm<z.infer<typeof volunteerForm>>({
    resolver: zodResolver(volunteerForm),
    defaultValues: {
      phone: "",
      emergencyContact: "",
      activities: [],
      availability: "",
      inspiration: "",
      certificate: [],
      interests: "",
      skills: "",
      story: "",
    },
  });

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Wrapper function for invisible reCAPTCHA + volunteerSubmit
  async function handleVolunteerSubmit(data: z.infer<typeof volunteerForm>) {
  try {
    const token = await recaptchaRef.current?.executeAsync();
    if (!token) {
      toast.error("reCAPTCHA verification failed.");
      return;
    }

    const result = await volunteerSubmit(data);

    if (result.success) {
      toast.success("Thank you! Your volunteer application has been submitted.");
      Form.reset();
      recaptchaRef.current?.reset();
      window.location.href = "/confirmation"; // <-- redirect on success
    } else {
      // Frontend redirect to error page
      console.error("Volunteer form submission failed:", result.error);
      window.location.href = "/error"; // <-- redirect on error
    }
  } catch (error: any) {
    toast.error(`Submission failed: ${error.message || error}`);
    console.error("Volunteer form submission failed:", error);
    window.location.href = "/error"; // <-- redirect on error
  }
}


  return (
    <div className="mt-5 flex w-full justify-center p-6 md:p-10">
      <div className="mb-10 w-full max-w-xl">
        <Card>
          <CardContent>
            <form id="volunteer-form" onSubmit={Form.handleSubmit(handleVolunteerSubmit)}>
              <FieldGroup>
                {/* Activities */}
                <Controller
                  name="activities"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet className="flex gap-3">
                      <FieldLegend className="font-semibold">
                        What kinds of activities would you like to help with?*
                      </FieldLegend>
                      {activityOptions.map((activity) => (
                        <Field key={activity} orientation="horizontal">
                          <Checkbox
                            id={activity}
                            checked={field.value.includes(activity)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, activity]);
                              } else {
                                field.onChange(field.value.filter((v) => v !== activity));
                              }
                            }}
                          />
                          <FieldLabel htmlFor={activity} className="capitalize">
                            {activity}
                          </FieldLabel>
                        </Field>
                      ))}
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldSet>
                  )}
                />

                {/* Volunteer Interests */}
                <Controller
                  name="interests"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="font-semibold" htmlFor={field.name}>
                        Other Volunteer interests?
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="interests"
                        aria-invalid={fieldState.invalid}
                        placeholder="Leave us a message..."
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Skills */}
                <Controller
                  name="skills"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="font-semibold" htmlFor={field.name}>
                        Do you have any special skills or experience you’d like to share?
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="skills"
                        aria-invalid={fieldState.invalid}
                        placeholder="This could be anything—past volunteer work, professional experience, or talents like cooking, organising, caregiving, etc. If not, no worries."
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Inspiration */}
                <Controller
                  name="inspiration"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="font-semibold" htmlFor={field.name}>
                        What inspires you to volunteer with us?*
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="inspiration"
                        aria-invalid={fieldState.invalid}
                        placeholder="We’d love to hear what brought you to LJM Memorial Hospice and what makes you want to help."
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Story */}
                <Controller
                  name="story"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="font-semibold" htmlFor={field.name}>
                        Your Story
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="story"
                        aria-invalid={fieldState.invalid}
                        placeholder="If you’d like, do you have a personal story or a connection to end-of-life care that you want to share?"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Availability */}
                <Controller
                  name="availability"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="font-semibold" htmlFor={field.name}>
                        What is your availability? *
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="availability"
                        aria-invalid={fieldState.invalid}
                        placeholder="Please let us know which days of the week and general time frames you’re available (for example: “Mondays and Thursdays”, “AM” or “PM”, “Flexible on weekends”)."
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Certificates */}
                <Controller
                  name="certificate"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet className="flex gap-3">
                      <FieldLegend className="font-semibold">
                        Do you have or can obtain the following?
                      </FieldLegend>
                      <Field orientation="horizontal">
                        <Checkbox
                          id="childrenCheck"
                          checked={field.value.includes("childrenCheck")}
                          onCheckedChange={(checked) => {
                            if (checked) field.onChange([...field.value, "childrenCheck"]);
                            else field.onChange(field.value.filter((v) => v !== "childrenCheck"));
                          }}
                        />
                        <FieldLabel htmlFor="childrenCheck">Working with Children Check</FieldLabel>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                      <Field orientation="horizontal">
                        <Checkbox
                          id="clearance"
                          checked={field.value.includes("clearance")}
                          onCheckedChange={(checked) => {
                            if (checked) field.onChange([...field.value, "clearance"]);
                            else field.onChange(field.value.filter((v) => v !== "clearance"));
                          }}
                        />
                        <FieldLabel htmlFor="clearance">Police Clearance</FieldLabel>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    </FieldSet>
                  )}
                />

                {/* Phone */}
                <Controller
                  name="phone"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="font-semibold" htmlFor={field.name}>
                        Phone Number*
                      </FieldLabel>
                      <Input
                        {...field}
                        id="phone"
                        type="tel"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter phone number"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Emergency Contact */}
                <Controller
                  name="emergencyContact"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="font-semibold" htmlFor={field.name}>
                        Emergency Contact Number*
                      </FieldLabel>
                      <Input
                        {...field}
                        id="emergencyContact"
                        type="tel"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter emergency contact"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Invisible reCAPTCHA */}
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  size="invisible"
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" form="volunteer-form">
              {Form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
