import React from "react";
import UserProfile from "@/components/UserProfile";

export default function page() {
  return (
    <div className="w-full p-6">
      <UserProfile pageName="Dashboard" />
    </div>
  );
}
