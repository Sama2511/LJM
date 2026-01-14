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
import {
  Upload,
  Trash2,
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Clock,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Save,
} from "lucide-react";
import UserProfile from "@/app/(root)/(users)/components/UserProfile";
import { Spinner } from "@/components/ui/spinner";
import { FetchSettings, UpdateSettings } from "@/actions/settings";

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

type SiteSettingsState = {
  contact_phone: string;
  contact_email: string;
  contact_location: string;
  contact_hours: string;
  social_linkedin: string;
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
};

const defaultSiteSettings: SiteSettingsState = {
  contact_phone: "",
  contact_email: "",
  contact_location: "",
  contact_hours: "",
  social_linkedin: "",
  social_facebook: "",
  social_instagram: "",
  social_youtube: "",
};

export default function ProfilePage() {
  const supabase = createClient();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [siteSettings, setSiteSettings] =
    useState<SiteSettingsState>(defaultSiteSettings);
  const [savingSiteSettings, setSavingSiteSettings] = useState(false);

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

  async function loadSiteSettings() {
    const result = await FetchSettings();
    if (result.data) {
      const settingsMap: SiteSettingsState = { ...defaultSiteSettings };
      result.data.forEach((setting) => {
        if (setting.setting_key in settingsMap) {
          settingsMap[setting.setting_key as keyof SiteSettingsState] =
            setting.setting_value || "";
        }
      });
      setSiteSettings(settingsMap);
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

  async function saveSiteSettings() {
    setSavingSiteSettings(true);
    const settingsArray = Object.entries(siteSettings).map(([key, value]) => ({
      key,
      value,
    }));

    const result = await UpdateSettings(settingsArray);

    if (result.success) {
      toast.success("Site settings saved successfully");
    } else {
      toast.error(result.error || "Failed to save site settings");
    }
    setSavingSiteSettings(false);
  }

  const handleSiteSettingChange = (
    key: keyof SiteSettingsState,
    value: string,
  ) => {
    setSiteSettings((prev) => ({ ...prev, [key]: value }));
  };

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
    loadSiteSettings();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-6">
        <UserProfile pageName="Settings" />
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
        <UserProfile pageName="Settings" />
        <p className="text-muted-foreground mt-6">
          Failed to load profile data
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <UserProfile pageName="Settings" />
      <div className="mt-5 max-w-4xl space-y-6">
        {/* Profile Picture Card */}
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

        {/* Site Settings - Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Update the contact details shown on the public Contact page
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="contact_phone"
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" /> Phone Number
              </Label>
              <Input
                id="contact_phone"
                value={siteSettings.contact_phone}
                onChange={(e) =>
                  handleSiteSettingChange("contact_phone", e.target.value)
                }
                placeholder="+61 0000 0000"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contact_email"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" /> Email Address
              </Label>
              <Input
                id="contact_email"
                type="email"
                value={siteSettings.contact_email}
                onChange={(e) =>
                  handleSiteSettingChange("contact_email", e.target.value)
                }
                placeholder="info@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contact_location"
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" /> Location
              </Label>
              <Input
                id="contact_location"
                value={siteSettings.contact_location}
                onChange={(e) =>
                  handleSiteSettingChange("contact_location", e.target.value)
                }
                placeholder="City, State"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contact_hours"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" /> Business Hours
              </Label>
              <Input
                id="contact_hours"
                value={siteSettings.contact_hours}
                onChange={(e) =>
                  handleSiteSettingChange("contact_hours", e.target.value)
                }
                placeholder="Mon – Fri: 9:00 am – 5:00 pm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Add your social media URLs to make the icons clickable on the
              Contact page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="social_linkedin"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </Label>
                <Input
                  id="social_linkedin"
                  value={siteSettings.social_linkedin}
                  onChange={(e) =>
                    handleSiteSettingChange("social_linkedin", e.target.value)
                  }
                  placeholder="https://linkedin.com/company/..."
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="social_facebook"
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4" /> Facebook
                </Label>
                <Input
                  id="social_facebook"
                  value={siteSettings.social_facebook}
                  onChange={(e) =>
                    handleSiteSettingChange("social_facebook", e.target.value)
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="social_instagram"
                  className="flex items-center gap-2"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </Label>
                <Input
                  id="social_instagram"
                  value={siteSettings.social_instagram}
                  onChange={(e) =>
                    handleSiteSettingChange("social_instagram", e.target.value)
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="social_youtube"
                  className="flex items-center gap-2"
                >
                  <Youtube className="h-4 w-4" /> YouTube
                </Label>
                <Input
                  id="social_youtube"
                  value={siteSettings.social_youtube}
                  onChange={(e) =>
                    handleSiteSettingChange("social_youtube", e.target.value)
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            <Button
              onClick={saveSiteSettings}
              disabled={savingSiteSettings}
              className="w-full bg-foreground text-background hover:bg-foreground/90"
            >
              {savingSiteSettings ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Site Settings
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
