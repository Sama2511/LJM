import React from "react";
import UserProfile from "@/app/(root)/(users)/components/UserProfile";
import AdminProfile from "../components/AdminProfile";

export default function page() {
  return (
    <div className="w-full p-6">
      <AdminProfile pageName="Dashboard" />
    </div>
  );
}
