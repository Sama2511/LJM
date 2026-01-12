"use server";

import { createClient } from "@/app/utils/server";
import { revalidatePath } from "next/cache";

export type SiteSetting = {
  id: string;
  setting_key: string;
  setting_value: string | null;
  updated_at: string;
};

export async function FetchSettings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("setting_key");

  if (error) {
    console.error("Error fetching settings:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function FetchSettingByKey(key: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("setting_value")
    .eq("setting_key", key)
    .single();

  if (error) {
    console.error(`Error fetching setting ${key}:`, error.message);
    return null;
  }

  return data?.setting_value;
}

export async function UpdateSettings(
  settings: { key: string; value: string }[]
) {
  const supabase = await createClient();

  for (const setting of settings) {
    const { error } = await supabase
      .from("site_settings")
      .update({
        setting_value: setting.value,
        updated_at: new Date().toISOString(),
      })
      .eq("setting_key", setting.key);

    if (error) {
      console.error(`Error updating setting ${setting.key}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/dashboard/SiteSettings");
  revalidatePath("/contact");
  return { success: true };
}
