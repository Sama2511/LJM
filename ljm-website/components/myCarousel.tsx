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

function MyCarousel() {
  return (
    <Carousel className="w-[250px]">
      <CarouselContent>
        <CarouselItem>
          <ServiceCard
            icon={RockingChair}
            title="Advance Care Planning"
            description="Practical support to record your end-of-life wishes, medical care, comfort, and decision-making."
          />
        </CarouselItem>
        <CarouselItem>
          <ServiceCard
            icon={Users}
            title="Compassionate Communities"
            description="Supportive community to share experiences, feelings, and find comfort together."
          />
        </CarouselItem>
        <CarouselItem>
          <ServiceCard
            icon={Coffee}
            title="Death Cafes"
            description="A safe, informal meet-up to talk about death, grief, and care, open to anyone and everyone."
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default MyCarousel;
