import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <section className="flex w-full flex-col items-center justify-between py-8 pl-4 sm:flex-col md:flex-row">
      <div className="flex max-w-md flex-col gap-10 text-center md:text-left lg:ml-30 lg:max-w-[700px]">
        <h1 className="text-3xl font-bold text-[#3E5F44] sm:text-4xl lg:text-5xl">
          Supporting Community With Compassion at Life's Most Sacred Moments
        </h1>
        <div className="flex justify-center gap-4 md:justify-start">
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
        width={450}
        height={450}
        className="mt-10 hidden w-full max-w-[300px] object-contain sm:block md:ml-auto md:max-w-[450px] lg:max-w-[600px]"
      />
    </section>
  );
}
