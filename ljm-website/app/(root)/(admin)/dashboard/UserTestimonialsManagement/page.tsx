// UserTestimonialsManagement/page.tsx
import AdminProfile from "../../components/AdminProfile";
import TestimonialsList from "../../components/TestimonialsList";
import { createClient } from "@/app/utils/server";

export default async function page() {
  const supabase = await createClient();

  // Fetch testimonials first
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

  // Get unique user IDs
  const userIds = testimonials?.map(t => t.user_id).filter(Boolean) || [];
  
  // Fetch user details separately
  const { data: users } = await supabase
    .from("users")
    .select("id, firstname, lastname")
    .in("id", userIds);

  // Create a map for quick lookup
  const userMap = new Map(users?.map(u => [u.id, u]));

  // Format testimonials with user names
  const formattedTestimonials = testimonials?.map((t: any) => {
    const user = userMap.get(t.user_id);
    return {
      id: t.id,
      user_name: user 
        ? `${user.firstname} ${user.lastname}` 
        : "Unknown User",
      event_title: t.event_title,
      comment: t.comment,
      reply: t.reply,
      created_at: t.created_at,
    };
  }) || [];

  return (
    <div className="@container w-full p-6">
      <AdminProfile pageName="Testimonials Management" />
      <TestimonialsList initialTestimonials={formattedTestimonials} />
    </div>
  );
}