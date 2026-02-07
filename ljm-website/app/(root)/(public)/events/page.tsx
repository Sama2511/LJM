import React from "react";
import { FetchEvent } from "@/actions/events";
import EventsClient from "../components/EventsClient";

export default async function page() {
  const events = await FetchEvent();

  return (
    <section className="mb-20 flex h-screen flex-col items-center">
      <EventsClient events={events.data || []} />
    </section>
  );
}
