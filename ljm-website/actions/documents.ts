"use server";

import { createClient } from "@/app/utils/server";
import { revalidatePath } from "next/cache";

export async function CreateDocument(title: string, fileUrl: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("documents").insert({
    title,
    file_url: fileUrl,
  });

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/DocumentManagement");
  revalidatePath("/about");
  return { success: true };
}

export async function FetchDocuments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function DeleteDocument(documentId: string) {
  const supabase = await createClient();

  const { data: document } = await supabase
    .from("documents")
    .select("file_url")
    .eq("id", documentId)
    .single();

  if (document?.file_url) {
    await supabase.storage.from("documents").remove([document.file_url]);
  }

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/DocumentManagement");
  revalidatePath("/about");
  return { success: true };
}
