import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function EventLoading() {
  return (
    <div className="flex flex-col space-y-3 pt-10">
      <Skeleton className="h-[165px] w-[350px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="mt-10 h-4 w-[350px]" />
        <Skeleton className="h-4 w-[350px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>
    </div>
  );
}
