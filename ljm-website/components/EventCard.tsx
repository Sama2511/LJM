import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
};

export function EventCard({
  title,
  description,
  date,
  time,
  location,
  imageUrl,
}: Props) {
  return (
    <>
      <Card className="flex w-[280px] gap-2 border-1 border-black bg-[#E2DFDA]">
        <CardHeader className="relative">
          <div className="">
            {imageUrl ? (
              <Image
                className="rounded-2xl"
                src={imageUrl}
                alt={title}
                width={350}
                height={180}
              />
            ) : (
              <Image
                src="/dummy-image-square8.png"
                alt="Event picture"
                width={300}
                height={180}
              />
            )}
          </div>
          <div className="rounded-b-0 absolute top-0 right-7 space-y-1 rounded-se-2xl bg-black/25 px-3 py-2 text-white shadow-[0_0_6px_rgba(0,0,0,0.5)] backdrop-blur-[2px]">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-green-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                {date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-green-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                {time}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="mb-1 text-xl text-[#3E5F44]">{title}</CardTitle>
          <div className="mb-3 flex items-center gap-1 text-sm">
            <MapPin className="size-4" />
            {location}
          </div>
          <CardDescription className="my-5 line-clamp-3 text-sm">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="mx-auto space-x-5">
          <Button asChild>
            <Link href="/volunteer"> Volunteer</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/event" className="px-6">
              Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export function PastEventCard({
  title,
  description,
  date,
  time,
  location,
  imageUrl,
}: Props) {
  return (
    <>
      <Card className="relative flex w-[280px] gap-2 border-1 border-black bg-[#E2DFDA]">
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-black/30" />
        <CardHeader className="pointer-events-none relative transition-all">
          <div className="">
            {imageUrl ? (
              <Image
                className="rounded-2xl"
                src={imageUrl}
                alt={title}
                width={350}
                height={180}
              />
            ) : (
              <Image
                src="/dummy-image-square8.png"
                alt="Event picture"
                width={300}
                height={180}
              />
            )}
          </div>
          <div className="rounded-b-0 absolute top-0 right-7 space-y-1 rounded-se-2xl bg-black/25 px-3 py-2 text-white shadow-[0_0_6px_rgba(0,0,0,0.5)] backdrop-blur-[2px]">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-green-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                {date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-green-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                {time}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="mb-1 text-xl text-[#3E5F44]">{title}</CardTitle>
          <div className="mb-3 flex items-center gap-1 text-sm">
            <MapPin className="size-4" />
            {location}
          </div>
          <CardDescription className="my-5 line-clamp-3 text-sm">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="mx-auto space-x-5">
          <Button asChild>
            <Link href="/volunteer"> Volunteer</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/event" className="px-6">
              Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
