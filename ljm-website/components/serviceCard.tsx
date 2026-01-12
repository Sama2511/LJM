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
    <Card className="grid h-full grid-rows-[1fr_10px_1fr] overflow-hidden border-none bg-gradient-to-b from-[#ff8200] from-30% to-[#f6f2e9] text-black">
      <CardHeader className="flex flex-col items-center text-center">
        <Icon className="h-16 w-16" />
        <h2 className="mt-4 px-5 text-2xl font-bold">{title}</h2>
      </CardHeader>

      <CardContent className="flex justify-center">
        <p className="w-[95%] text-center leading-relaxed">{description}</p>
      </CardContent>

      <CardFooter className="mt-auto flex justify-center pt-1">
        <Button asChild variant="outline">
          <Link href="/services" className="text-black">
            More Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;
