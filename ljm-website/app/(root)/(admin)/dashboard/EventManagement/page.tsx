import React, { Suspense } from "react";
import EventForm from "../../components/EventForm";
import EventList from "../../components/EventList";
import EventLoading from "../../components/EventLoading";

export default async function page() {
  return (
    <div className="@container w-full">
      <div className="flex justify-between pt-15 pr-10">
        <h1 className="font-chillax text-2xl font-semibold md:text-3xl">
          Event Management
        </h1>
      </div>
      <div className="flex justify-end pt-10 pr-10">
        <EventForm />
      </div>
      <Suspense fallback={<EventLoading />}>
        <EventList />
      </Suspense>
    </div>
  );
}
