"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

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

      await supabase
        .from("users")
        .update({ avatar_url: null })
        .eq("id", user);

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
      <h1 className="text-3xl font-bold mb-3">My Profile</h1>
      <p className="text-gray-600 mb-8">Manage your personal information.</p>

      <div className="bg-muted shadow-md rounded-2xl p-6 max-w-xl">
        
        {/* AVATAR BLOCK */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-[70px] h-[70px] border">
            <AvatarImage src={userData.avatar_url || ""} />
            <AvatarFallback className="bg-[#3E5F44] text-white text-xl">
              {userData.firstname?.charAt(0).toUpperCase()}
              {userData.lastname?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col leading-tight">
            <label className="cursor-pointer text-green-700 underline text-sm">
              {uploading ? "Uploading..." : "Upload Avatar"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadAvatar}
              />
            </label>

            <button
              onClick={deleteAvatar}
              className="text-red-600 underline text-sm mt-1"
              disabled={uploading}
            >
              Delete Avatar
            </button>
          </div>
        </div>

        {/* First Name */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">First Name</label>
          <input
            type="text"
            value={userData.firstname || ""}
            onChange={(e) =>
              setUserData({ ...userData, firstname: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Last Name */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={userData.lastname || ""}
            onChange={(e) =>
              setUserData({ ...userData, lastname: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Phone Number</label>
          <input
            type="text"
            value={userData.phonenumber || ""}
            onChange={(e) =>
              setUserData({ ...userData, phonenumber: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium">Role</label>
          <p className="text-gray-800 font-semibold">{userData.role}</p>
        </div>

    {/*Save button with spinner*/}
        <Button onClick={saveChanges} disabled={saving}>
          {saving ? (
            <>
              <Spinner className="mr-2" /> Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}