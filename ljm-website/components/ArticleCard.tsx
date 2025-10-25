import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function ArticleCard() {
  return (
    <div className="m-auto mb-10 flex w-[300px] flex-col items-start gap-5">
      <Image
        alt="image of the article"
        src="/dummy-image-square8.png"
        width={310}
        height={310}
      />
      <div>
        <h1 className="text-[22px] text-[#4C7F5D]">Article's Title</h1>
        <p className="text-md mt-1 line-clamp-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua ...
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="" className="w-fit bg-white px-8 font-semibold">
          Read More
        </Link>
      </Button>
    </div>
  );
}
