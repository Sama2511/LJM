import { FetchEvent } from "@/actions/events";
import VolunteerEventCard from "@/app/(root)/(users)/components/VolunteerEventCard";
import UserProfile from "@/app/(root)/(users)/components/UserProfile";

export default async function BrowseEventsPage() {
  const eventsData = await FetchEvent();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (timeString: string) => {
    const [h, m] = timeString.split(":");
    const hour = parseInt(h);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
  };

  return (
    <div className="w-full p-6">
      <UserProfile pageName="Browse Events" />

      <div className="flex flex-wrap gap-8">
        {eventsData.data?.map((event) => (
          <VolunteerEventCard
            key={event.id}
            id={event.id}
            title={event.title}
            description={event.description}
            date={formatDate(event.date)}
            time={`${formatTime(event.starts_at)} - ${formatTime(event.ends_at)}`}
            location={event.location}
            image={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`}
            capacity={0}
            maxCapacity={event.capacity}
          />
        ))}
      </div>
    </div>
  );
}
