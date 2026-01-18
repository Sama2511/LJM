import React from "react";
import Image from "next/image";

type profile = {
  member: string;
  role: string;
  imageUrl: string;
};

export default function ProfileCard({ member, role, imageUrl }: profile) {
  return (
    <div className="flex w-[170px] flex-col items-center text-center gap-2 p-2">
      <div className="relative h-[150px] w-[150px]">
        {imageUrl ? (
          <Image
            fill
            src={imageUrl}
            alt={member}
            className="border border-accent object-cover rounded-lg"
          />
        ) : (
          <Image
            fill
            className="border border-accent object-cover rounded-lg"
            src="/AvatarDummy.png"
            alt={member}
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-[14px] font-semibold text-foreground leading-snug break-words">
          {member}
        </h3>
        <p className="text-[12px] text-muted-foreground leading-snug break-words">
          {role}
        </p>
      </div>
    </div>
  );
}
