// app/(root)/(users)/testimonials/page.tsx
import { submitTestimonial } from "@/actions/testimonials";

interface PageProps {
  searchParams: {
    eventId?: string;
    eventTitle?: string;
  };
}

export default function NewTestimonialPage({ searchParams }: PageProps) {
  const eventId = searchParams.eventId ?? "";
  const eventTitle = searchParams.eventTitle ?? "Event";

  return (
    <div className="mx-auto mt-10 max-w-xl">
      <h1 className="mb-4 text-2xl font-semibold">Leave a Testimonial</h1>

      <form action={submitTestimonial} className="space-y-4">
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="eventTitle" value={eventTitle} />

        <textarea
          name="comment"
          required
          minLength={10}
          placeholder="Share your experience with this event..."
          className="w-full rounded-md border p-3"
        />
        <a href={"/UserDashboard"}>
        <button
          
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Submit Testimonial
        </button>
        </a>
      </form>
    </div>
  );
}
