"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Trash2, User, Mail, Phone, Shield } from "lucide-react";
import UserProfile from "@/app/(root)/(users)/components/UserProfile";
import { Spinner } from "@/components/ui/spinner";

interface UserData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber?: string;
  avatar_url?: string;
  role: string;
  status?: string;
  formcompleted: boolean;
  created_at: string;
}

export default function ProfilePage() {
  const supabase = createClient();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname?.charAt(0)}${lastname?.charAt(0)}`.toUpperCase();
  };

  async function loadUser() {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData.user) {
        toast.error("Failed to get user");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile");
        setLoading(false);
        return;
      }

      setUserData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading user:", error);
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  }

  async function saveChanges() {
    if (!userData) return;

    setSaving(true);

    try {
      const { data: authData } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("users")
        .update({
          firstname: userData.firstname,
          lastname: userData.lastname,
          phonenumber: userData.phonenumber,
        })
        .eq("id", authData.user?.id);

      if (error) {
        toast.error("Failed to update profile");
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error(uploadError);
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
        .eq("id", userId);

      setUserData((prev) =>
        prev
          ? {
              ...prev,
              avatar_url: urlData.publicUrl,
            }
          : null,
      );

      toast.success("Avatar updated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Unexpected error");
    } finally {
      setUploading(false);
    }
  }

  async function deleteAvatar() {
    try {
      setUploading(true);

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      if (!userId) return;

      if (!userData?.avatar_url) {
        toast.error("No avatar to delete");
        setUploading(false);
        return;
      }

      const fileExt = userData.avatar_url.split(".").pop();
      const filePath = `${userId}.${fileExt}`;

      await supabase.storage.from("avatars").remove([filePath]);

      await supabase
        .from("users")
        .update({ avatar_url: null })
        .eq("id", userId);

      setUserData((prev) =>
        prev
          ? {
              ...prev,
              avatar_url: undefined,
            }
          : null,
      );

      toast.success("Avatar deleted successfully!");
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

  if (loading) {
    return (
      <div className="w-full p-6">
        <UserProfile pageName="Profile" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-48 w-full max-w-2xl" />
          <Skeleton className="h-96 w-full max-w-2xl" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full p-6">
        <UserProfile pageName="Profile" />
        <p className="text-muted-foreground mt-6">
          Failed to load profile data
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <UserProfile pageName="Profile" />
      <div className="mt-5 max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription className="font-sans">
              Update your profile picture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-18 w-18">
                <AvatarImage
                  src={userData.avatar_url}
                  alt={`${userData.firstname} ${userData.lastname}`}
                />
                <AvatarFallback className="bg-foreground text-2xl text-background">
                  {getInitials(userData.firstname, userData.lastname)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <label htmlFor="avatar-upload">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="cursor-pointer"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? (
                      <p className="flex items-center gap-1">
                        <Spinner />
                        Uploading
                      </p>
                    ) : (
                      "Upload Avatar"
                    )}
                  </Button>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={uploadAvatar}
                    disabled={uploading}
                  />
                </label>
                {userData.avatar_url && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={deleteAvatar}
                    disabled={uploading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Avatar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstname">
                  <User className="mb-1 inline h-4 w-4" /> First Name
                </Label>
                <Input
                  id="firstname"
                  type="text"
                  value={userData.firstname || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, firstname: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">
                  <User className="mb-1 inline h-4 w-4" /> Last Name
                </Label>
                <Input
                  id="lastname"
                  type="text"
                  value={userData.lastname || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, lastname: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="mb-1 inline h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-muted-foreground text-xs">
                Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="mb-1 inline h-4 w-4" /> Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phonenumber || ""}
                onChange={(e) =>
                  setUserData({ ...userData, phonenumber: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label>
                <Shield className="mb-1 inline h-4 w-4" /> Role
              </Label>
              <div className="bg-muted flex h-10 items-center rounded-md px-3">
                <p className="text-sm font-medium capitalize">
                  {userData.role}
                </p>
              </div>
            </div>

            {userData.status && (
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="bg-muted flex h-10 items-center rounded-md px-3">
                  <p className="text-sm font-medium capitalize">
                    {userData.status}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={saveChanges}
              disabled={saving}
              className="w-full bg-foreground text-background hover:bg-foreground/90"
            >
              {saving ? (
                <p className="flex items-center gap-1">
                  <Spinner />
                  Saving
                </p>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
