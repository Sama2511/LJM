import React from "react";
import Image from "next/image";

type profile = {
  member: string;
  role: string;
  imageUrl: string;
};

export default function ProfileCard({ member, role, imageUrl }: profile) {
  return (
    <div className="grid w-auto items-center justify-center overflow-hidden rounded-lg text-left">
      <div className="relative h-[150px] w-[150px]">
        {imageUrl ? (
          <Image
            fill
            src={imageUrl}
            alt={member}
            className="border-1 border-accent object-cover rounded-lg"
          />
        ) : (
          <Image
            fill
            className="border-1 border-accent object-cover rounded-lg"
            src="/AvatarDummy.png"
            alt={member}
          />
        )}
      </div>

      <div className="pt-4">
        <h3 className="text-[15px] font-semibold text-foreground">{member}</h3>
        <p className="text-[12px] text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}