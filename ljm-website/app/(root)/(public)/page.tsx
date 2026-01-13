import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import MyCarouselServices from "@/components/myCarousel";
import { EventCard } from "@/components/EventCard";
import EventLoading from "../(admin)/components/EventLoading";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import HeroSlideshow from "@/components/HeroSlideshow";

export default function Home() {
  return (
    <>
      <section className="@container mt-5">
        <div className="flex flex-col @[1000]:flex-row @[1000]:items-center">
          {/* Left side - Text content */}
          <div className="relative flex w-full flex-col items-center text-center @[630]:items-start @[630]:pt-8 @[630]:pl-7 @[700]:pl-15 @[1000]:w-1/2 @[1000]:pl-20 @[1600]:pl-50">
            <div className="relative mt-10 w-full">
              <Image
                src="/newMobilePic.png"
                alt="Home page image"
                width={450}
                height={450}
                className="w-full object-cover @[1000]:hidden"
              />
              <h1
                className="sm:text-foreground font-chillax absolute top-6 left-6 max-w-[70%] text-left leading-tight font-semibold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)] @[550]:max-w-[80%] @[800]:pt-[10px] @[1000]:static @[1000]:max-w-[100%] @[1000]:pt-[30px] @[1000]:drop-shadow-[0px] @[1200]:pt-[50px] @[1400]:pt-[2rem]"
                style={{ fontSize: "clamp(1.375rem, 0.5rem + 3vw, 3.438rem)" }}
              >
                Support With Compassion at Life's Most Sacred Moments
              </h1>
            </div>
            <p className="text-foreground/80 mt-4 max-w-[90%] text-center font-sans text-base @[630]:max-w-[85%] @[630]:text-left @[800]:text-lg @[1000]:max-w-[80%] @[1000]:text-xl @[1200]:max-w-[75%]">
              Providing dignified end-of-life care, grief support, and community
              resources to families during their most challenging times.
            </p>
            <div className="mt-6 flex justify-center gap-4 @[630]:mt-8 @[630]:flex-col @[700]:flex-row @[700]:justify-start @[800]:w-full @[1000]:mb-10">
              <Button asChild>
                <Link
                  href="/donation"
                  className="flex items-center justify-center border-2 border-accent py-5 text-[18px] @[800]:py-5 @[800]:text-[20px] @[1000]:px-8 @[1200]:py-6 @[1200]:text-[22px] @[1600]:py-6 @[1600]:text-[28px]"
                >
                  Donate Now
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  href="/"
                  className="bg-background flex items-center justify-center border-2 py-[19px] text-[18px] font-bold text-black @[800]:py-5 @[800]:text-[20px] @[1000]:px-8 @[1200]:py-6 @[1200]:text-[22px] @[1600]:py-6 @[1600]:text-[28px]"
                >
                  Join The Crew
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side - Slideshow */}
          <div className="hidden @[1000]:flex @[1000]:w-1/2 @[1000]:items-center @[1000]:justify-center">
            <HeroSlideshow />
          </div>
        </div>
      </section>

      <div
        className="from-background via-background to-muted h-50 bg-gradient-to-b"
        aria-hidden="true"
      >
        <div className="container mx-auto py-16"></div>
      </div>

      <section className="bg-muted">
        <div className="flex flex-col items-center gap-20">
          <h1 className="text-foreground font-chillax text-5xl font-medium sm:text-6xl lg:text-7xl">
            Our Services
          </h1>
          <MyCarouselServices />
        </div>
      </section>
      <div
        className="from-background via-background to-muted h-50 bg-gradient-to-t"
        aria-hidden="true"
      >
        <div className="container mx-auto py-16"></div>
      </div>
      <section className="flex w-full flex-col items-center gap-20">
        <h1 className="text-foreground font-chillax max-w-[70%] text-center text-5xl leading-tight font-medium sm:text-6xl lg:text-7xl">
          Upcoming Events
        </h1>
        <Suspense fallback={<EventLoading />}>
          <UpcomingEvents />
        </Suspense>
      </section>
      <section className="mt-40 bg-muted p-10">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <h1 className="text-center font-serif text-3xl text-black">
            Subscribe to Our Newsletter
          </h1>
          <div className="flex w-full max-w-sm flex-col items-center gap-2 md:flex-row">
            <Input
              type="email"
              placeholder="Email"
              className="w-70 bg-background"
            />
            <Button type="submit" variant="outline" className="w-70 md:w-30">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
