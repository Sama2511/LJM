import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

import MyCarouselServices from "@/components/MyCarousel";
import { EventCard } from "@/components/EventCard";
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
            <h1
              className="sm:text-foreground font-chillax absolute top-6 left-6 max-w-[70%] text-left leading-tight font-semibold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)] @[550]:max-w-[80%] @[630]:static @[630]:max-w-[100%] @[630]:drop-shadow-[0px] @[800]:pt-[10px] @[1000]:pt-[30px] @[1200]:pt-[50px] @[1400]:pt-[2rem]"
              style={{ fontSize: "clamp(1.375rem, 0.5rem + 3vw, 3.438rem)" }}
            >
              Supporte With Compassion at Life's Most Sacred Moments
            </h1>
          </div>
          <p className="text-foreground/80 mt-4 max-w-[90%] text-center font-sans text-base @[630]:max-w-[85%] @[630]:text-left @[800]:text-lg @[1000]:max-w-[80%] @[1000]:text-xl @[1200]:max-w-[75%]">
            Providing dignified end-of-life care, grief support, and community
            resources to families during their most challenging times.
          </p>
          <div className="mt-6 flex justify-center gap-4 @[630]:mt-8 @[630]:flex-col @[700]:flex-row @[700]:justify-start @[800]:w-full">
            <Button asChild>
              <Link
                href="/"
                className="flex items-center justify-center border-2 border-[#6d9d79] py-5 text-[18px] @[800]:py-5 @[800]:text-[20px] @[1000]:px-8 @[1200]:py-6 @[1200]:text-[22px] @[1600]:py-6 @[1600]:text-[28px]"
              >
                Donate Now
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link
                href="/"
                className="flex items-center justify-center border-2 py-[19px] text-[18px] font-bold @[800]:py-5 @[800]:text-[20px] @[1000]:px-8 @[1200]:py-6 @[1200]:text-[22px] @[1600]:py-6 @[1600]:text-[28px]"
              >
                Join The Crew
              </Link>
            </Button>
          </div>
        </div>

        <Image
          src="/newHomePic.png"
          alt="Home page image"
          width={400}
          height={400}
          className="@[800]:w-[370px]@ mt-10 hidden @[630]:block @[800]:h-[370px] @[890]:h-[400px] @[890]:w-[400px] @[1000]:h-[450] @[1000]:w-[450] @[1200]:h-[500] @[1200]:w-[500] @[1400]:h-[600] @[1400]:w-[600] @[1600]:h-[700] @[1600]:w-[700] @[1800]:h-[700] @[1800]:w-[700]"
        />
      </section>

      <div
        className="font-ch h-50 bg-gradient-to-b from-[#F8F5F0] via-[#F8F5F0] to-[#ebe0cd]"
        aria-hidden="true"
      >
        <div className="container mx-auto py-16"></div>
      </div>

      <section className="bg-[#ebe0cd]">
        <div className="flex flex-col items-center gap-20">
          <h1 className="text-foreground font-chillax text-5xl font-medium sm:text-6xl lg:text-7xl">
            Our Services
          </h1>
          <MyCarouselServices />
        </div>
      </section>
      <div
        className="h-50 bg-gradient-to-t from-[#F8F5F0] via-[#F8F5F0] to-[#ebe0cd]"
        aria-hidden="true"
      >
        <div className="container mx-auto py-16"></div>
      </div>
      <section className="flex w-full flex-col items-center gap-20">
        <h1 className="text-foreground font-chillax max-w-[70%] text-center text-5xl leading-tight font-medium sm:text-6xl lg:text-7xl">
          Upcoming Events
        </h1>
        <div className="grid max-w-[95%] grid-flow-col gap-4 overflow-auto pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-[#62605d] [&::-webkit-scrollbar-track]:rounded-2xl [&::-webkit-scrollbar-track]:bg-[#e2dfda]">
          <EventCard
            title="Event Title"
            description="Description of the Event: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliquaDescription of the Event Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqu"
            date="September 9, 2025 "
            time="9:00 AM - 1:00 PM"
            location="Location"
            imageUrl=""
          />
          <EventCard
            title="Event Title"
            description="Description of the Event: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliquaDescription of the Event Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqu"
            date="September 9, 2025 "
            time="9:00 AM - 1:00 PM"
            location="Location"
            imageUrl=""
          />
          <EventCard
            title="Event Title"
            description="Description of the Event: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliquaDescription of the Event: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqu"
            date="September 9, 2025 "
            time="9:00 AM - 1:00 PM"
            location="Location"
            imageUrl=""
          />
          <EventCard
            title="Event Title"
            description="Description of the Event: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliquaDescription of the Event: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqu"
            date="September 9, 2025 "
            time="9:00 AM - 1:00 PM"
            location="Location"
            imageUrl=""
          />
        </div>
      </section>
      <section className="mt-40 bg-[#e6dac7] p-10">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <h1 className="text-center font-serif text-3xl font-bold text-[#3E5F44]">
            Subscribe to Our Newsletter
          </h1>
          <div className="flex w-full max-w-sm flex-col items-center gap-2 md:flex-row">
            <Input
              type="email"
              placeholder="Email"
              className="w-70 bg-[#f8f5f0]"
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
