import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
};

export function EventCard({
  title,
  description,
  date,
  time,
  location,
  image,
}: Props) {
  return (
    <>
      <Card className="group bg-muted w-[320px] overflow-hidden rounded-2xl p-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <CardTitle>
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={image || "/dummy-image-square8.png"}
              alt="event image"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              fill
            />
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="absolute bottom-3 left-4">
              <h2 className="text-2xl font-semibold text-white drop-shadow">
                {title}
              </h2>
            </div>
          </div>
        </CardTitle>

        <CardContent className="grid grid-rows-[120px_25px]">
          <div className="text-foreground mb-6 space-y-3 text-sm">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{location}</span>
            </div>
            <p className="text-foreground/80 mt-4 mb-6 line-clamp-3 text-base">
              {description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between px-6 pt-2 pb-6 font-semibold">
          <Button asChild>
            <Link href="/volunteer">Volunteer</Link>
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
  image,
}: Props) {
  return (
    <>
      <Card className="group relative w-[320px] overflow-hidden rounded-2xl bg-[#E2DFDA] p-0 shadow-md transition-all duration-300">
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-black/30" />
        <CardTitle>
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={image || "/dummy-image-square8.png"}
              alt="event image"
              className="h-full w-full object-cover"
              fill
            />

            <div className="absolute inset-0 bg-black/30"></div>

            <div className="absolute bottom-3 left-4">
              <h2 className="text-2xl font-semibold text-white drop-shadow">
                {title}
              </h2>
            </div>
          </div>
        </CardTitle>

        <CardContent className="grid grid-rows-[160px_25px]">
          <div className="text-foreground mb-6 space-y-3 text-sm">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{location}</span>
            </div>
            <p className="text-foreground/80 mb-6 line-clamp-3 text-base">
              {description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between px-6 pt-2 pb-6 font-semibold">
          <Button disabled={true}>Volunteer</Button>
          <Button variant="outline" disabled={true}>
            Details
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
