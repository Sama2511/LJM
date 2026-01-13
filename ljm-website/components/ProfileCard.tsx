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
      <div className="">
        {imageUrl ? (
          <Image
            width={150}
            height={150}
            src={imageUrl}
            alt={member}
            className="border-1 border-accent"
          />
        ) : (
          <Image
            width={150}
            height={150}
            className="border-1 border-accent"
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
