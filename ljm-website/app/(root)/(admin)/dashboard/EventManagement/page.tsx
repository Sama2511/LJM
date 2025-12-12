import React, { Suspense } from "react";
import EventForm from "../../components/EventForm";
import EventList from "../../components/EventList";
import EventLoading from "../../components/EventLoading";
import AdminProfile from "../../components/AdminProfile";

export default async function page() {
  return (
    <div className="@container w-full p-6">
      <AdminProfile pageName="Event Management" />
      <div className="flex justify-end">
        <EventForm />
      </div>
      <Suspense fallback={<EventLoading />}>
        <EventList />
      </Suspense>
    </div>
  );
}
