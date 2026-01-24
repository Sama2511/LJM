// UserTestimonialsManagement/page.tsx
import AdminProfile from "../../components/AdminProfile";
import TestimonialsList from "../../components/TestimonialsList";
import { createClient } from "@/app/utils/server";

export default async function page() {
  const supabase = await createClient();

  // fetch testimonials and join with users table (select firstname and lastname)
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select(`
      id,
      comment,
      reply,
      created_at,
      event_title,
      user_id
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials:", error);
  }

  const formattedTestimonials = testimonials?.map((t: any) => ({
    id: t.id,
    user_name: t.user_id, // temporarily just show the UUID
    event_title: t.event_title,
    comment: t.comment,
    reply: t.reply,
    created_at: t.created_at,
  })) || [];


  return (
    <div className="@container w-full p-6">
      <AdminProfile pageName="Testimonials Management" />
      <TestimonialsList initialTestimonials={formattedTestimonials} />
    </div>
  );
}
