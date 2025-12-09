import React, { Suspense } from "react";
import EventForm from "../../components/EventForm";
import EventList from "../../components/EventList";
import EventLoading from "../../components/EventLoading";
import UserProfile from "@/components/UserProfile";

export default async function page() {
  return (
    <div className="@container w-full p-6">
      <UserProfile pageName="Event Management" />
      <div className="flex justify-end">
        <EventForm />
      </div>
      <Suspense fallback={<EventLoading />}>
        <EventList />
      </Suspense>
    </div>
  );
}
