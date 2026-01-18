import React, { Suspense } from "react";
import AdminProfile from "../../components/AdminProfile";
import TestimonialsList from "../../components/TestimonialsList";
import TestimonialsLoading from "../../components/TestimonialsLoading";

export default async function page() {
  return (
    <div className="@container w-full p-6">
      <AdminProfile pageName="Testimonials Management" />

      <Suspense fallback={<TestimonialsLoading />}>
        <TestimonialsList />
      </Suspense>
    </div>
  );
}
