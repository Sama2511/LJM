import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const event = new Array(3).fill(0);
export default function EventLoading() {
  return (
    <div className="flex flex-wrap justify-center gap-10 py-10 pr-5 md:pl-5 @[830]:justify-start">
      {event.map((_: any, index: number) => (
        <div className="flex flex-col space-y-3 pt-10" key={index}>
          <Skeleton className="h-[165px] w-[350px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="mt-10 h-4 w-[350px]" />
            <Skeleton className="h-4 w-[350px]" />
            <Skeleton className="h-4 w-[350px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
