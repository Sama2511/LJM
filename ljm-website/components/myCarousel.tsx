import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ServiceCard from "./serviceCard";
import { RockingChair, Coffee, Users } from "lucide-react";

function MyCarouselServices() {
  return (
    <Carousel
      className="m-auto w-[250px] sm:w-[550px] lg:w-[850px]"
      opts={{
        align: "start",
      }}
    >
      <CarouselContent className="-ml-4">
        <CarouselItem className="pl-4 sm:basis-1/2 lg:basis-1/3">
          <ServiceCard
            icon={RockingChair}
            title="Advance Care Planning"
            description="Practical support to record your end-of-life wishes, medical care, comfort, and decision-making."
          />
        </CarouselItem>
        <CarouselItem className="pl-4 sm:basis-1/2 lg:basis-1/3">
          <ServiceCard
            icon={Users}
            title="Compassionate Communities"
            description="Supportive community to share experiences, feelings, and find comfort together."
          />
        </CarouselItem>
        <CarouselItem className="pl-4 sm:basis-1/2 lg:basis-1/3">
          <ServiceCard
            icon={Coffee}
            title="Death Cafes"
            description="A safe, informal meet-up to talk about death, grief, and care, open to anyone and everyone."
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="lg:hidden" />
      <CarouselNext className="lg:hidden" />
    </Carousel>
  );
}
export default MyCarouselServices;
