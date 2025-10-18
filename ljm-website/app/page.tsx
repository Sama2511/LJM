import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="@container mt-5 flex">
        <div className="relative flex w-full flex-col items-center text-center @[630]:items-start @[630]:pt-8 @[630]:pl-7 @[700]:pl-15 @[1000]:pl-20 @[1600]:pl-50">
          <div className="relative mt-10 w-full">
            <Image
              src="/newMobilePic.png"
              alt="Home page image"
              width={450}
              height={450}
              className="w-full object-cover @[630]:hidden"
            />
            <h1 className="absolute top-6 left-6 max-w-[70%] text-left text-2xl font-semibold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)] @[470]:text-[30px] @[500]:max-w-[70%] @[550]:max-w-[80%] @[550]:text-[40px] @[630]:static @[630]:max-w-[100%] @[630]:text-[26px] @[630]:text-[#3E5F44] @[630]:drop-shadow-[0px] @[800]:pt-[10px] @[800]:text-[30px] @[1000]:pt-[30px] @[1000]:text-[38px] @[1200]:pt-[50px] @[1200]:text-[42px] @[1400]:pt-[2rem] @[1400]:text-[48px] @[1700]:text-[55px]">
              Supporting Community With Compassion at Life's Most Sacred Moments
            </h1>
          </div>
          <div className="mt-6 flex justify-center gap-4 @[630]:mt-6 @[630]:flex-col @[700]:flex-row @[700]:justify-start @[800]:w-full">
            <Button asChild>
              <Link
                href="/"
                className="flex items-center justify-center gap-6 border-2 border-[#6d9d79] py-5 text-[18px] @[800]:py-6 @[800]:text-[22px] @[1000]:px-12 @[1200]:py-7 @[1200]:text-[30px] @[1600]:py-9 @[1600]:text-[40px]"
              >
                Donate Now
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href="/"
                className="flex items-center justify-center border-2 border-[#759D7E] py-[19px] text-[18px] font-bold text-[#3E5F44] @[800]:py-6 @[800]:text-[22px] @[1000]:px-12 @[1200]:py-[29px] @[1200]:text-[30px] @[1600]:py-[38px] @[1600]:text-[40px]"
              >
                Join The Crew
              </Link>
            </Button>
          </div>
        </div>

        <Image
          src="/HomePagePic.png"
          alt="Home page image"
          width={400}
          height={400}
          className="@[800]:w-[370px]@ mt-10 hidden @[630]:block @[800]:h-[370px] @[890]:h-[400px] @[890]:w-[400px] @[1000]:h-[450] @[1000]:w-[450] @[1200]:h-[500] @[1200]:w-[500] @[1400]:h-[600] @[1400]:w-[600] @[1600]:h-[700] @[1600]:w-[700] @[1800]:h-[700] @[1800]:w-[700]"
        />
      </section>
    </>
  );
}
