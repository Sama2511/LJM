"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import imageCompression from "browser-image-compression";

import { Textarea } from "@/components/ui/textarea";
import { eventForm } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { v4 as uuid } from "uuid";
import { CreateEvent } from "@/actions/events";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Plus, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { createClient } from "@/app/utils/client";
import { Calendar22 } from "./DatePicker";

async function uploadImage(file: File) {
  const supabase = createClient();
  try {
    file = await imageCompression(file, {
      maxSizeMB: 1,
    });
  } catch (error) {
    console.log(error);
  }
  const { data, error } = await supabase.storage
    .from("event-pics")
    .upload(uuid(), file);
  if (data) {
    return data.path;
  } else {
    throw error;
  }
}

export default function EventForm() {
  const [isopen, setOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imgUrl, setImageUrl] = useState<string[]>([]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileUrls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setImageUrl(fileUrls);
    }
  };

  useEffect(() => {
    if (!isopen) {
      form.reset();
      setImageUrl([]);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }, [isopen]);

  const form = useForm<z.infer<typeof eventForm>>({
    resolver: zodResolver(eventForm),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      starts_at: "",
      ends_at: "",
      location: "",
      image_url: "",
      roles: [{ role_name: "", capacity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "roles",
  });
  return (
    <Sheet open={isopen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Create Event
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-muted w-[370px] overflow-y-auto sm:w-[420px]"
      >
        <SheetHeader>
          <SheetTitle className="text-xl">Create Event</SheetTitle>
        </SheetHeader>
        <form
          id="event-form"
          onSubmit={form.handleSubmit(async (data) => {
            const file = imageInputRef.current?.files?.[0];

            if (file) {
              try {
                const publicUrl = await uploadImage(file);
                data.image_url = publicUrl;
              } catch (error) {
                toast.error("Something went wrong");
                return;
              }
            } else {
              data.image_url = "placeholderImage.png";
            }
            const result = await CreateEvent(data);
            if (result.success) {
              toast.success("Great succes");
              form.reset();
              setImageUrl([]);
              setOpen(false);
              if (imageInputRef.current) {
                imageInputRef.current.value = "";
              }
            } else {
              toast.error("Oh no");
            }
          })}
        >
          <FieldGroup className="px-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-semibold" htmlFor={field.name}>
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Event Title"
                    className="bg-popover"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-semibold" htmlFor={field.name}>
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Event description"
                    className="bg-popover"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-semibold" htmlFor={field.name}>
                    Location
                  </FieldLabel>
                  <Input
                    {...field}
                    id="location"
                    aria-invalid={fieldState.invalid}
                    placeholder="Event location"
                    className="bg-popover"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-fit">
                  <FieldLabel className="font-semibold" htmlFor={field.name}>
                    Date
                  </FieldLabel>
                  <Calendar22 date={field.value} onChange={field.onChange} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-4">
              <Controller
                name="starts_at"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-fit">
                    <FieldLabel className="font-semibold" htmlFor={field.name}>
                      Start At
                    </FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="starts_at"
                      aria-invalid={fieldState.invalid}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="ends_at"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-fit">
                    <FieldLabel className="font-semibold" htmlFor={field.name}>
                      Ends At
                    </FieldLabel>
                    <Input
                      {...field}
                      type="time"
                      id="ends_at"
                      aria-invalid={fieldState.invalid}
                      className="bg-background w-fit appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Field>
              <FieldLabel className="font-semibold">Roles</FieldLabel>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Controller
                      name={`roles.${index}.role_name`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          placeholder="Role name"
                          className="bg-popover flex-1"
                          aria-invalid={fieldState.invalid}
                        />
                      )}
                    />
                    <Controller
                      name={`roles.${index}.capacity`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Input
                          type="number"
                          min={1}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="Capacity"
                          className="bg-popover w-20"
                          aria-invalid={fieldState.invalid}
                        />
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="text-destructive hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {index === fields.length - 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => append({ role_name: "", capacity: 1 })}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {form.formState.errors.roles && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.roles.message ||
                    form.formState.errors.roles.root?.message}
                </p>
              )}
            </Field>
            <Controller
              name="image_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="">
                  <FieldLabel className="font-semibold" htmlFor={field.name}>
                    Upload Image
                  </FieldLabel>
                  <input
                    id="image_url"
                    type="file"
                    hidden
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    {imgUrl.length > 0 ? "Change Image" : "Select Image"}
                  </Button>
                  <div className="flex gap-4">
                    {imgUrl.length === 0 && (
                      <div className="text-foreground w-full rounded-md border-2 border-dashed p-8 text-center text-sm">
                        No image yet
                      </div>
                    )}
                    {imgUrl.map((image, index) => (
                      <Image
                        alt="Event's image"
                        key={index}
                        src={image}
                        width={300}
                        height={300}
                      />
                    ))}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <SheetFooter className="flex flex-row">
          <Button
            type="submit"
            form="event-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner /> Create
              </>
            ) : (
              "Create"
            )}
          </Button>
          <SheetClose asChild>
            <Button
              onClick={() => {
                form.reset();
                setImageUrl([]);
                if (imageInputRef.current) {
                  imageInputRef.current.value = "";
                }
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
