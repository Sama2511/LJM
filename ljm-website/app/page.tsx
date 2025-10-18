import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="@container flex">
        <div className="@[630]: relative flex w-full flex-col items-center text-center">
          <div className="relative mt-10 w-full">
            <Image
              src="/newMobilePic.png"
              alt="Home page image"
              width={450}
              height={450}
              className="w-full object-cover @[630]:hidden"
            />
            <h1 className="absolute top-6 left-6 max-w-[80%] text-left text-2xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)] @[470]:text-[30px] @[500]:max-w-[70%] @[550]:max-w-[80%] @[550]:text-[40px] @[630]:static">
              Supporting Community With Compassion at Life's Most Sacred Moments
            </h1>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/">
              <Button className="flex items-center justify-center py-5 text-[18px] font-bold">
                <Heart />
                Donate Now
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center justify-center py-[19px] text-[18px] font-bold text-[#3E5F44]"
              >
                Become a Volunteer
              </Button>
            </Link>
          </div>
        </div>

        <Image
          src="/HomePagePic.png"
          alt="Home page image"
          width={300}
          height={300}
          className="mt-10 hidden @[630]:block"
        />
      </section>
    </>
  );
}
