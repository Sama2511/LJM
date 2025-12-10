import React from "react";
import { FetchEvent } from "@/actions/events";
import EventsClient from "../components/EventsClient";

export default async function page() {
  const events = await FetchEvent();

  return (
    <section className="my-10 flex w-full flex-col items-center">
      <EventsClient events={events.data || []} />
    </section>
  );
}
