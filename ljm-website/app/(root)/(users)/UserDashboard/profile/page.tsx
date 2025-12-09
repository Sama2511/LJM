"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/client";

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
    toast.success("Profile updated!");
  }

  // Upload Avatar
  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      const file = event.target.files[0];
      if (!file) return;

      const user = (await supabase.auth.getUser()).data.user?.id;
      if (!user) {
        toast.error("User not logged in");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${user}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.log(uploadError);
        toast.error("Error uploading avatar");
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await supabase
        .from("users")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", user);

      setUserData((prev: any) => ({
        ...prev,
        avatar_url: urlData.publicUrl,
      }));

      toast.success("Avatar updated!");
    } catch (e) {
      console.error(e);
      toast.error("Unexpected error");
    } finally {
      setUploading(false);
    }
  }

  // Delete Avatar
  async function deleteAvatar() {
    try {
      setUploading(true);

      const user = (await supabase.auth.getUser()).data.user?.id;
      if (!user) return;

      if (!userData.avatar_url) {
        toast.error("No avatar to delete");
        setUploading(false);
        return;
      }

      const fileExt = userData.avatar_url.split(".").pop();
      const filePath = `${user}.${fileExt}`;

      await supabase.storage.from("avatars").remove([filePath]);

      await supabase.from("users").update({ avatar_url: null }).eq("id", user);

      setUserData((prev: any) => ({
        ...prev,
        avatar_url: null,
      }));

      toast.success("Avatar deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting avatar");
    } finally {
      setUploading(false);
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

      <div className="max-w-xl rounded-lg bg-white p-6 shadow-sm">
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

            <button
              onClick={deleteAvatar}
              className="mt-1 text-sm text-red-600 underline"
              disabled={uploading}
            >
              Delete Avatar
            </button>
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

        {/* Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium">Role</label>
          <p className="font-semibold text-gray-800">{userData.role}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium">Status</label>
          <p className="font-semibold text-gray-800">{userData.status}</p>
        </div>

        <button
          onClick={saveChanges}
          disabled={saving}
          className="rounded-md bg-green-700 px-6 py-2 text-white hover:bg-green-800"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
