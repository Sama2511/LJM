"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/app/utils/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function ProfilePage() {
  const supabase = createClient();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadUser() {
    const user = (await supabase.auth.getUser()).data.user?.id;
    if (!user) return;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user)
      .single();

    setUserData(data);
    setLoading(false);
  }

  async function saveChanges() {
    setSaving(true);

    const user = (await supabase.auth.getUser()).data.user?.id;

    await supabase
      .from("users")
      .update({
        firstname: userData.firstname,
        lastname: userData.lastname,
        phonenumber: userData.phonenumber,
      })
      .eq("id", user);

    setSaving(false);
    alert("Profile updated!");
  }

  // -----------------------
  // 🚀 Upload Avatar Handler
  // -----------------------
  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      const file = event.target.files[0];
      if (!file) return;

      const user = (await supabase.auth.getUser()).data.user?.id;
      if (!user) {
        alert("User not logged in");
        return;
      }

      // имя файла = userId + расширение
      const fileExt = file.name.split(".").pop();
      const filePath = `${user}.${fileExt}`;

      // загрузка в Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.log(uploadError);
        alert("Error uploading avatar");
        setUploading(false);
        return;
      }

      // публичный URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // обновление таблицы users
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", user);

      if (updateError) {
        console.log(updateError);
        alert("Error saving avatar URL");
        setUploading(false);
        return;
      }

      // обновление UI
      setUserData((prev: any) => ({
        ...prev,
        avatar_url: urlData.publicUrl,
      }));

      setUploading(false);
      alert("Avatar updated!");
    } catch (e) {
      console.error(e);
      alert("Unexpected error");
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="mb-3 text-3xl font-bold">My Profile</h1>
      <p className="mb-8 text-gray-600">Manage your personal information.</p>

      <div className="bg-muted max-w-xl rounded-lg p-6 shadow-sm">
        {/* Avatar */}

        <div className="mb-6 flex items-center gap-4">
          <Image
            src={userData.avatar_url || "/default-avatar.png"}
            width={70}
            height={70}
            className="rounded-full border"
            alt="Avatar"
          />
          <div>
            <label className="cursor-pointer text-green-700 underline">
              {uploading ? "Uploading..." : "Upload Avatar"}
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadAvatar}
              />
            </label>
          </div>
        </div>

        {/* First Name */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">First Name</label>
          <Input
            type="text"
            value={userData.firstname || ""}
            onChange={(e) =>
              setUserData({ ...userData, firstname: e.target.value })
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Last Name */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={userData.lastname || ""}
            onChange={(e) =>
              setUserData({ ...userData, lastname: e.target.value })
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            value={userData.phonenumber || ""}
            onChange={(e) =>
              setUserData({ ...userData, phonenumber: e.target.value })
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Non-editable fields */}
        <div className="mb-6">
          <label className="block text-sm font-medium">Role</label>
          <p className="font-semibold text-gray-800">{userData.role}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium">Status</label>
          <p className="font-semibold text-gray-800">{userData.status}</p>
        </div>

        <Button onClick={saveChanges} disabled={saving}>
          {saving ? (
            <p className="flex gap-2">
              <Spinner />
              Saving
            </p>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
