import React from "react";
import { EventCard, PastEventCard } from "@/components/EventCard";

export default function page() {
  return (
    <section className="my-10 flex w-full flex-col items-center gap-6">
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-foreground font-serif text-5xl font-bold sm:text-6xl lg:text-7xl">
          Events
        </h1>
        <h2 className="mt-5 max-w-[90%] text-center text-xl">
          Explore our collection of articles, guides, and resources to help you
          navigate end-of-life care decisions and find support during difficult
          times.
        </h2>
      </div>
      <h3 className="mt-10 text-2xl font-semibold">Upcoming Events</h3>
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

      {/*  */}
      {/* Past events area  */}
      {/*  */}
      <h3 className="mt-10 text-2xl font-semibold">Past Events</h3>
      <div className="grid max-w-[95%] grid-flow-col gap-4 overflow-auto pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-[#62605d] [&::-webkit-scrollbar-track]:rounded-2xl [&::-webkit-scrollbar-track]:bg-[#e2dfda]">
        <PastEventCard
          title="Event Title"
          description="Description of the Event: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliquaDescription of the Event Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqu"
          date="September 9, 2025 "
          time="9:00 AM - 1:00 PM"
          location="Location"
          imageUrl=""
        />
        <PastEventCard
          title="Event Title"
          description="Description of the Event: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliquaDescription of the Event Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqu"
          date="September 9, 2025 "
          time="9:00 AM - 1:00 PM"
          location="Location"
          imageUrl=""
        />
      </div>
    </section>
  );
}
