"use client";
import { getUser } from "@/app/utils/server";
import { redirect } from "next/navigation";
import React from "react";
import { check, file, z } from "zod";
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

export default function page() {
  // const user = getUser()
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
      activitites: [],
      availability: "",
      inspiration: "",
      certificate: [],
      intrests: "",
      skills: "",
      story: "",
    },
  });

  return (
    <div className="mt-5 flex w-full justify-center p-6 md:p-10">
      <div className="mb-10 w-full max-w-xl">
        <Card className="">
          <CardContent>
            <form id="volunteer-form">
              <FieldGroup>
                <Controller
                  name="activitites"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet className="flex gap-3">
                      <FieldLegend className="font-semibold">
                        What kinds of activities would you like to help with?*
                      </FieldLegend>
                      {activityOptions.map((activity) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          orientation="horizontal"
                        >
                          <Checkbox
                            id={activity}
                            {...field.value}
                            checked={field.value.includes(activity)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, activity]);
                              } else {
                                field.onChange(
                                  field.value.filter((v) => v !== activity),
                                );
                              }
                            }}
                          />
                          <FieldLabel htmlFor={activity} className="capitalize">
                            {activity}
                          </FieldLabel>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      ))}
                    </FieldSet>
                  )}
                />
                <Controller
                  name="intrests"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        Other Volunteer interest?
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="intrests"
                        aria-invalid={fieldState.invalid}
                        placeholder="Leave us a message..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="skills"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        Do you have any special skills or experience you’d like
                        to share?
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="skills"
                        aria-invalid={fieldState.invalid}
                        placeholder="This could be anything—past volunteer work, professional experience, or talents like cooking, organising, caregiving, etc. If not, no worries.
"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="inspiration"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        What inspires you to volunteer with us?*
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="inspiration"
                        aria-invalid={fieldState.invalid}
                        placeholder="We’d love to hear what brought you to LJM Memorial Hospice and what makes you want to help.
"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="story"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        Your Story
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="story"
                        aria-invalid={fieldState.invalid}
                        placeholder="If you’d like, do you have a personal story or a connection to end-of-life care that you want to share?"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="availability"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="font-semibold"
                        htmlFor={field.name}
                      >
                        What is your availability? *
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="availability"
                        aria-invalid={fieldState.invalid}
                        placeholder="Please let us know which days of the week and general time frames you’re available (for example: “Mondays and Thursdays”, “AM” or “PM”, “Flexible on weekends”)."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="certificate"
                  control={Form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet className="flex gap-3">
                      <FieldLegend className="font-semibold">
                        Do you have or can obtain the following ?
                      </FieldLegend>
                      <Field
                        data-invalid={fieldState.invalid}
                        orientation="horizontal"
                      >
                        <Checkbox
                          id="childrenCheck"
                          {...field.value}
                          checked={field.value.includes("childrenCheck")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, "childrenCheck"]);
                            } else {
                              field.onChange(
                                field.value.filter(
                                  (v) => v !== "childrenCheck",
                                ),
                              );
                            }
                          }}
                        />
                        <FieldLabel htmlFor="childrenCheck">
                          Working with Children Check
                        </FieldLabel>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                      <Field
                        data-invalid={fieldState.invalid}
                        orientation="horizontal"
                      >
                        <Checkbox
                          id="clearance"
                          {...field.value}
                          checked={field.value.includes("clearance")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, "clearance"]);
                            } else {
                              field.onChange(
                                field.value.filter((v) => v !== "clearance"),
                              );
                            }
                          }}
                        />
                        <FieldLabel htmlFor="clearance">
                          Police Clearance
                        </FieldLabel>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    </FieldSet>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
