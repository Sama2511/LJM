import React from "react";

export default function LoadingEditEvents() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#3E5F44]"></div>
      <p className="text-lg text-[#3E5F44]">Loading...</p>
    </div>
  );
}
