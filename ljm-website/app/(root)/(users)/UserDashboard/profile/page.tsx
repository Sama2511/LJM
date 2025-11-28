"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

export default function ProfilePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    setUserData(data);
    setLoading(false);
  }

  async function saveChanges() {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("users")
      .update({
        firstname: userData.firstname,
        lastname: userData.lastname,
        phonenumber: userData.phonenumber,
      })
      .eq("id", user?.id);

    setSaving(false);
    alert("Profile updated!");
  }

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-3">My Profile</h1>
      <p className="text-gray-600 mb-8">Manage your personal information.</p>

      <div className="bg-white shadow-sm rounded-lg p-6 max-w-xl">

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={userData.avatar_url || "/default-avatar.png"}
            width={70}
            height={70}
            className="rounded-full border"
            alt="Avatar"
          />
          <div>
            <p className="text-lg font-semibold">
              {userData.firstname} {userData.lastname}
            </p>
            <p className="text-sm text-gray-500">{userData.email}</p>
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

        {/* Non-editable fields */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <p className="text-gray-800 font-semibold">{userData.role}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <p className="text-gray-800 font-semibold">{userData.status}</p>
        </div>

        <button
          onClick={saveChanges}
          disabled={saving}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}