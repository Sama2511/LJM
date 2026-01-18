// actions/testimonials.ts
"use client"; // this will be used only on the client

export interface Testimonial {
  eventId: string;
  comment: string;
  id: string;
  createdAt: string;
  reply?: string;
  status?: string;
}

// Temporary in-memory store
let mockTestimonials: Testimonial[] = [];

export async function submitTestimonial(data: { eventId: string; comment: string }) {
  const newTestimonial: Testimonial = {
    ...data,
    id: String(mockTestimonials.length + 1),
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  mockTestimonials.unshift(newTestimonial); // add to start of array
  return newTestimonial;
}

// Optional helper to fetch all testimonials for a user
export function getUserTestimonials() {
  return mockTestimonials;
}
