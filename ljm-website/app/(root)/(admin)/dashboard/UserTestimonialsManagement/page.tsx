import { Suspense } from "react";
import AdminProfile from "../../components/AdminProfile";
import TestimonialsList from "../../components/TestimonialsList";
import TestimonialsLoading from "../../components/TestimonialsLoading";
import { createClient } from "@/app/utils/server";

async function TestimonialsContent() {
  const supabase = await createClient();

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select(
      `
      id,
      comment,
      reply,
      created_at,
      event_title,
      user_id
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials:", error);
    return (
      <p className="text-destructive py-8 text-center">
        Failed to load testimonials. Please try again.
      </p>
    );
  }

  const userIds = testimonials?.map((t) => t.user_id).filter(Boolean) || [];

  let userMap = new Map();
  if (userIds.length > 0) {
    const { data: users } = await supabase
      .from("users")
      .select("id, firstname, lastname")
      .in("id", userIds);

    userMap = new Map(users?.map((u) => [u.id, u]));
  }

  const formattedTestimonials =
    testimonials?.map((t) => {
      const user = userMap.get(t.user_id);
      return {
        id: t.id,
        user_name: user ? `${user.firstname} ${user.lastname}` : "Unknown User",
        event_title: t.event_title,
        comment: t.comment,
        reply: t.reply,
        created_at: t.created_at,
      };
    }) || [];

  return <TestimonialsList initialTestimonials={formattedTestimonials} />;
}

export default function Page() {
  return (
    <div className="@container w-full pt-10 pr-4 pb-10">
      <AdminProfile pageName="Testimonials Management" />
      <Suspense fallback={<TestimonialsLoading />}>
        <TestimonialsContent />
      </Suspense>
    </div>
  );
}
