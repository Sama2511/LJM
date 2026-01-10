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
import { articleForm } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { v4 as uuid } from "uuid";
import { CreateArticle } from "@/actions/articles";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { createClient } from "@/app/utils/client";

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
    .from("article-pics")
    .upload(uuid(), file);
  if (data) {
    return data.path;
  } else {
    throw error;
  }
}

export default function ArticleForm() {
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

  const form = useForm<z.infer<typeof articleForm>>({
    resolver: zodResolver(articleForm),
    defaultValues: {
      title: "",
      content: "",
      image_url: "",
    },
  });

  return (
    <Sheet open={isopen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Create Article
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-muted w-[370px] overflow-y-auto sm:w-[420px]"
      >
        <SheetHeader>
          <SheetTitle className="text-xl">Create Article</SheetTitle>
        </SheetHeader>
        <form
          id="article-form"
          onSubmit={form.handleSubmit(async (data) => {
            const file = imageInputRef.current?.files?.[0];

            if (file) {
              try {
                const publicUrl = await uploadImage(file);
                data.image_url = publicUrl;
              } catch (error) {
                toast.error("Something went wrong");
                console.log(error);
                return;
              }
            } else {
              data.image_url = "placeholderImage.png";
            }

            const result = await CreateArticle(data);
            if (result.success) {
              toast.success("Article created successfully");
              form.reset();
              setImageUrl([]);
              setOpen(false);
              if (imageInputRef.current) {
                imageInputRef.current.value = "";
              }
            } else {
              toast.error("Failed to create article");
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
                    placeholder="Article Title"
                    className="bg-popover"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-semibold" htmlFor={field.name}>
                    Content
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="content"
                    aria-invalid={fieldState.invalid}
                    placeholder="Article content..."
                    className="bg-popover min-h-[200px]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="image_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-semibold" htmlFor={field.name}>
                    Upload Image (Optional)
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
                        No image selected
                      </div>
                    )}
                    {imgUrl.map((image, index) => (
                      <Image
                        alt="Article's image"
                        key={index}
                        src={image}
                        width={300}
                        height={300}
                        className="rounded-lg object-cover"
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
            form="article-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner /> Creating...
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
