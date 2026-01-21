// components/TestimonialsList.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateTestimonialReply } from "@/actions/admin-testimonials";

interface Testimonial {
  id: string;
  user_name: string;
  event_title: string;
  comment: string;
  reply?: string;
  created_at: string;
}

// Server Component version
export default function TestimonialsList({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  if (!initialTestimonials || initialTestimonials.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        No testimonials submitted yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {initialTestimonials.map((t) => (
        <Card key={t.id} className="p-4 shadow-md">
          <CardContent>
            <p className="font-semibold">{t.user_name}</p>
            <p className="text-sm text-muted-foreground">
              Event: {t.event_title}
            </p>

            <p className="mt-2">{t.comment}</p>

            {t.reply && (
              <p className="mt-2 text-blue-600">
                <strong>Admin Reply:</strong> {t.reply}
              </p>
            )}

            <p className="mt-2 text-xs text-muted-foreground">
              Submitted: {new Date(t.created_at).toLocaleString()}
            </p>
          </CardContent>

          <CardFooter>
            {/* Optional: Form to submit reply server-side */}
            <form
              action={async (formData: FormData) => {
                "use server"; // Next.js server action
                const reply = formData.get("reply")?.toString() || "";
                if (reply) {
                  await updateTestimonialReply(t.id, reply);
                }
              }}
            >
              <Textarea
                name="reply"
                placeholder="Reply (optional)"
                defaultValue={t.reply || ""}
              />
              <Button type="submit" className="mt-2">
                Save Reply
              </Button>
            </form>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
