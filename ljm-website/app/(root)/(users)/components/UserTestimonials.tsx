// app/(root)/(users)/components/UserTestimonials.tsx
import { getUserTestimonials } from "@/actions/testimonials";

export default async function UserTestimonials() {
  const testimonials = await getUserTestimonials();

  if (testimonials.length === 0) {
    return (
      <p className="mt-4 text-center text-muted-foreground">
        You haven’t submitted any testimonials yet.
      </p>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">My Testimonials</h2>
      <ul className="space-y-4">
        {testimonials.map((t) => (
          <li key={t.id} className="rounded-md border bg-muted p-3">
            <p className="mb-1 text-sm text-muted-foreground">
              Event: <span className="font-semibold">{t.event_title}</span> |{" "}
              {new Date(t.created_at).toLocaleString()}
            </p>

            <p>{t.comment}</p>

            {t.reply && (
              <p className="mt-2 text-sm text-primary">
                <strong>Admin reply:</strong> {t.reply}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
