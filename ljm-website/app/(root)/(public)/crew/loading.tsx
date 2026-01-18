import React from "react";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary"></div>
      <p className="text-lg text-primary">Loading...</p>
    </div>
  );
}
