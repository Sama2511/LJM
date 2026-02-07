import { FetchEvent } from "@/actions/events";
import UserProfile from "@/app/(root)/(users)/components/UserProfile";
import {
  GetUserVolunteerRequests,
  VolunteerCapacity,
} from "@/actions/volunteer";
import { getUser } from "@/app/utils/server";
import BrowseEventsClient from "@/app/(root)/(users)/components/BrowseEventsClient";

export default async function BrowseEventsPage() {
  const eventsData = await FetchEvent();
  const capacityData = await VolunteerCapacity();
  const user = await getUser();
  const userRequests = user ? await GetUserVolunteerRequests(user.id) : null;

  return (
    <div className="w-full">
      <div className="max-w-8xl mx-auto w-full py-10 pr-6">
        <UserProfile pageName="Browse Events" />
        <div className="mt-8">
          <BrowseEventsClient
            events={eventsData.data ?? []}
            capacities={capacityData.data ?? []}
            userRequests={userRequests?.data ?? []}
          />
        </div>
      </div>
    </div>
  );
}
