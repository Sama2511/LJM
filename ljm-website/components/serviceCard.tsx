import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function ServiceCard({ icon: Icon, title, description }: ServiceCardProps) {
  return (
    <Card className="grid h-full grid-rows-[1fr_10px_1fr] overflow-hidden border-none bg-gradient-to-b from-[#5E936C] from-30% to-[#1D2D21] text-white">
      <CardHeader className="flex flex-col items-center text-center">
        <Icon className="h-16 w-16 text-black" />
        <h2 className="mt-4 px-5 text-2xl font-bold">{title}</h2>
      </CardHeader>

      <CardContent className="flex justify-center">
        <p className="w-[95%] text-center leading-relaxed">{description}</p>
      </CardContent>

      <CardFooter className="mt-auto flex justify-center pt-1">
        <Button asChild variant="outline">
          <Link href="/service" className="text-black">
            More Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;
