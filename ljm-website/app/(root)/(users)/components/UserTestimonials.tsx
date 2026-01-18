"use client";

import { useEffect, useState } from "react";
import { getUserTestimonials, Testimonial } from "@/actions/testimonials";

export default function UserTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const data = getUserTestimonials();
    setTestimonials(data);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading testimonials...</p>;
  if (testimonials.length === 0) return <p>You haven’t submitted any testimonials yet.</p>;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">My Testimonials</h2>
      <ul className="space-y-4">
        {testimonials.map((t) => (
          <li key={t.id} className="border p-3 rounded-md">
            <p><strong>Comment:</strong> {t.comment}</p>
            {t.reply && <p className="text-blue-600"><strong>Admin Reply:</strong> {t.reply}</p>}
            <p className="text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
