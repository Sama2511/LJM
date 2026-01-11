"use server";

import { createClient } from "@/app/utils/server";
import { articleForm } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function CreateArticle(formData: z.infer<typeof articleForm>) {
  const supabase = await createClient();

  const { error } = await supabase.from("articles").insert({
    title: formData.title,
    content: formData.content,
    image_url: formData.image_url || null,
  });

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/ArticleManagement");
  revalidatePath("/articles");
  return { success: true };
}

export async function FetchArticles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function FetchArticleById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching article:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function UpdateArticle(
  articleId: string,
  formData: z.infer<typeof articleForm>,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("articles")
    .update({
      title: formData.title,
      content: formData.content,
      image_url: formData.image_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId);

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/ArticleManagement");
  revalidatePath("/articles");
  return { success: true };
}

export async function DeleteArticle(articleId: string) {
  const supabase = await createClient();

  // Get article to check for image
  const { data: article } = await supabase
    .from("articles")
    .select("image_url")
    .eq("id", articleId)
    .single();

  // Delete image from storage if exists
  if (article?.image_url) {
    await supabase.storage.from("article-pics").remove([article.image_url]);
  }

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", articleId);

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/ArticleManagement");
  revalidatePath("/articles");
  return { success: true };
}
