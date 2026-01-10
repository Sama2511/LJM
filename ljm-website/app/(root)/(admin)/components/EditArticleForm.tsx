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
import { FetchArticleById, UpdateArticle } from "@/actions/articles";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Pencil } from "lucide-react";
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

export default function EditArticleForm({ id }: { id: string }) {
  const [isopen, setOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imgUrl, setImageUrl] = useState<string[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileUrls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setImageUrl(fileUrls);
    }
  };

  const form = useForm<z.infer<typeof articleForm>>({
    resolver: zodResolver(articleForm),
    defaultValues: {
      title: "",
      content: "",
      image_url: "",
    },
  });

  useEffect(() => {
    if (isopen) {
      FetchArticleById(id).then((res) => {
        if (res.data) {
          form.reset({
            title: res.data.title,
            content: res.data.content,
            image_url: res.data.image_url || "",
          });
          if (res.data.image_url) {
            setExistingImageUrl(res.data.image_url);
          }
        }
      });
    } else {
      form.reset();
      setImageUrl([]);
      setExistingImageUrl(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }, [isopen, id]);

  return (
    <Sheet open={isopen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-muted w-[370px] overflow-y-auto sm:w-[420px]"
      >
        <SheetHeader>
          <SheetTitle className="text-xl">Edit Article</SheetTitle>
        </SheetHeader>
        <form
          id="edit-article-form"
          onSubmit={form.handleSubmit(async (data) => {
            const file = imageInputRef.current?.files?.[0];

            if (file) {
              try {
                const publicUrl = await uploadImage(file);
                data.image_url = publicUrl;
              } catch (error) {
                toast.error("Failed to upload image");
                return;
              }
            } else if (existingImageUrl) {
              data.image_url = existingImageUrl;
            }

            const result = await UpdateArticle(id, data);
            if (result.success) {
              toast.success("Article updated successfully");
              setOpen(false);
            } else {
              toast.error("Failed to update article");
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
                    {imgUrl.length > 0 || existingImageUrl
                      ? "Change Image"
                      : "Select Image"}
                  </Button>
                  <div className="flex gap-4">
                    {imgUrl.length === 0 && !existingImageUrl && (
                      <div className="text-foreground w-full rounded-md border-2 border-dashed p-8 text-center text-sm">
                        No image selected
                      </div>
                    )}
                    {imgUrl.length > 0
                      ? imgUrl.map((image, index) => (
                          <Image
                            alt="Article's image"
                            key={index}
                            src={image}
                            width={300}
                            height={300}
                            className="rounded-lg object-cover"
                          />
                        ))
                      : existingImageUrl && (
                          <Image
                            alt="Article's image"
                            src={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/article-pics/${existingImageUrl}`}
                            width={300}
                            height={300}
                            className="rounded-lg object-cover"
                          />
                        )}
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
            form="edit-article-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
