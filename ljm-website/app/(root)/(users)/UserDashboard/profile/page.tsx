"use client";
import Link from "next/link";
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
  emergency_contact?: string;
  availability?: string;
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

      const userId = authData.user.id;

      // 1. users
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError) {
        toast.error("Failed to load user data");
        setLoading(false);
        return;
      }

      // 2. volunteer_form (phone)
      const { data: form } = await supabase
        .from("volunteer_form")
        .select("phone, emergency_contact, availability")
        .eq("user_id", userId)
        .single();

      setUserData({
        ...user,
        phonenumber: form?.phone ?? "",
        emergency_contact: form?.emergency_contact ?? "",
        availability: form?.availability ?? "",
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error");
      setLoading(false);
    }
  }

  async function saveChanges() {
    if (!userData) return;

    setSaving(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      if (!userId) {
        toast.error("User not found");
        return;
      }

      // 1. Обновляем users
      const { error: userError } = await supabase
        .from("users")
        .update({
          firstname: userData.firstname,
          lastname: userData.lastname,
        })
        .eq("id", userId);

      if (userError) throw userError;

      // 2. Обновляем phone в volunteer_form
      const { error: formError } = await supabase
        .from("volunteer_form")
        .update({
          phone: userData.phonenumber,
          emergency_contact: userData.emergency_contact,
          availability: userData.availability,
        })
        .eq("user_id", userId);

      if (formError) throw formError;

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
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
    <div className="w-full pt-5 pr-7">
      <UserProfile pageName="Profile" />
      <div className="mt-5 mb-10 max-w-2xl space-y-6">
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
                <AvatarFallback className="bg-foreground text-background text-2xl">
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
            <div className="mt-1">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Change password
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Phone */}
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

              {/* Emergency Contact */}
              <div className="space-y-2">
                <Label htmlFor="emergency">
                  <Phone className="mb-1 inline h-4 w-4" /> Emergency Contact
                </Label>
                <Input
                  id="emergency"
                  type="tel"
                  value={userData.emergency_contact || ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      emergency_contact: e.target.value,
                    })
                  }
                  placeholder="Emergency contact number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                type="text"
                value={userData.availability || ""}
                onChange={(e) =>
                  setUserData({ ...userData, availability: e.target.value })
                }
                placeholder="e.g. Weekends, evenings"
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
              className="bg-foreground text-background hover:bg-foreground/90 w-full"
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
