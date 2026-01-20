"use client";

import { useEffect, useState } from "react";
import { getUserTestimonials, Testimonial } from "@/actions/testimonials";

export default function UserTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      setLoading(true);
      try {
        const data = await getUserTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to load testimonials:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTestimonials();
  }, []);

  if (loading) return <p className="mt-4 text-center">Loading testimonials...</p>;
  if (testimonials.length === 0)
    return <p className="mt-4 text-center text-muted-foreground">You haven’t submitted any testimonials yet.</p>;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">My Testimonials</h2>
      <ul className="space-y-4">
        {testimonials.map((t) => (
          <li key={t.id} className="border p-3 rounded-md bg-muted">
            <p className="text-sm text-muted-foreground mb-1">
              Event: <span className="font-semibold">{t.event_title}</span> |{" "}
              {new Date(t.created_at).toLocaleString()}
            </p>
            <p className="text-foreground">{t.comment}</p>
            {t.reply && (
              <p className="mt-2 text-sm text-primary">
                Admin Reply: {t.reply}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
