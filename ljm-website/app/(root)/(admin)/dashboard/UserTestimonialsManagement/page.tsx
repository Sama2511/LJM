// UserTestimonialsManagement/page.tsx
import AdminProfile from "../../components/AdminProfile";
import TestimonialsList from "../../components/TestimonialsList";
import { createClient } from "@/app/utils/server";

export default async function page() {
  const supabase = await createClient();

  // fetch testimonials and join with users table
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select(`
      id,
      comment,
      reply,
      created_at,
      event_title,
      user:user_id ( id, email, full_name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  const formattedTestimonials = testimonials?.map((t: any) => ({
    id: t.id,
    user_name: t.user?.full_name || t.user?.email || "Unknown",
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
