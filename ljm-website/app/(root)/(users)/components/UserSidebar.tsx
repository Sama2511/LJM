"use client";

import UserNavMain from "./UserNavMain";
import UserNavUser from "./UserNavUser";

export default function UserSidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r p-6">
      <h2 className="text-xl font-bold mb-8">Volunteer Portal</h2>

      <UserNavMain />

      <div className="absolute bottom-6 left-6 right-6">
        <UserNavUser />
      </div>
    </div>
  );
}