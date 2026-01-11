"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Plus, FileText } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { createClient } from "@/app/utils/client";
import { v4 as uuid } from "uuid";
import { CreateDocument } from "@/actions/documents";

async function uploadPdf(file: File) {
  const supabase = createClient();
  const fileName = `${uuid()}.pdf`;
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(fileName, file, {
      contentType: "application/pdf",
    });
  if (data) {
    return data.path;
  } else {
    throw error;
  }
}

export default function DocumentForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are allowed");
        setSelectedFile(null);
        return;
      }
      setFileError("");
      setSelectedFile(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setTitleError("");
    setFileError("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    let hasError = false;
    if (!title.trim()) {
      setTitleError("Title is required");
      hasError = true;
    } else if (title.trim().length < 3) {
      setTitleError("Title must be at least 3 characters");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (!selectedFile) {
      setFileError("Please select a PDF file");
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);

    try {
      const fileUrl = await uploadPdf(selectedFile!);
      const result = await CreateDocument(title.trim(), fileUrl);

      if (result.success) {
        toast.success("Document uploaded successfully");
        resetForm();
        setIsOpen(false);
      } else {
        toast.error("Failed to upload document");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload document");
    }

    setIsSubmitting(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Upload Document
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-muted w-[370px] overflow-y-auto sm:w-[420px]"
      >
        <SheetHeader>
          <SheetTitle className="text-xl">Upload Document</SheetTitle>
        </SheetHeader>
        <form id="document-form" onSubmit={handleSubmit}>
          <FieldGroup className="px-4">
            <Field data-invalid={!!titleError}>
              <FieldLabel className="font-semibold">Document Title</FieldLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Annual Report 2024"
                className="bg-popover"
              />
              {titleError && (
                <p className="text-destructive text-sm">{titleError}</p>
              )}
            </Field>

            <Field data-invalid={!!fileError}>
              <FieldLabel className="font-semibold">PDF File</FieldLabel>
              <input
                type="file"
                accept=".pdf,application/pdf"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? "Change File" : "Select PDF"}
              </Button>

              {selectedFile ? (
                <div className="bg-popover flex items-center gap-2 rounded-md border p-3">
                  <FileText className="h-5 w-5" />
                  <span className="truncate text-sm">{selectedFile.name}</span>
                </div>
              ) : (
                <div className="text-foreground w-full rounded-md border-2 border-dashed p-8 text-center text-sm">
                  No file selected
                </div>
              )}

              {fileError && (
                <p className="text-destructive text-sm">{fileError}</p>
              )}
            </Field>
          </FieldGroup>
        </form>
        <SheetFooter className="flex flex-row">
          <Button type="submit" form="document-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
          <SheetClose asChild>
            <Button onClick={resetForm} variant="outline">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
