import React from "react";
import EventForm from "../../components/dashboardNav/EventForm";

export default function page() {
  return (
    <div className="w-full">
      <div className="flex justify-between pt-15 pr-10">
        <h1 className="font-chillax text-3xl font-semibold">
          Event Management
        </h1>
        <EventForm />
      </div>
    </div>
  );
}
