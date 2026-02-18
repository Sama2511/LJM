import { getUserTestimonials } from "@/actions/testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Reply, Calendar } from "lucide-react";

export default async function UserTestimonials() {
  let testimonials;
  try {
    testimonials = await getUserTestimonials();
  } catch {
    return (
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">My Testimonials</h2>
        <p className="text-destructive text-center text-sm">
          Failed to load testimonials. Please try again later.
        </p>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">My Testimonials</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <MessageSquare className="text-muted-foreground mb-3 h-10 w-10" />
          <p className="text-muted-foreground text-sm">
            You haven&apos;t submitted any testimonials yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">My Testimonials</h2>
      <div className="space-y-4">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  {t.event_title}
                </div>
                <span className="text-muted-foreground text-xs">
                  {new Date(t.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="text-foreground/80 text-sm leading-relaxed">
                &ldquo;{t.comment}&rdquo;
              </p>

              {t.reply && (
                <div className="border-primary/20 bg-primary/5 rounded-md border p-3">
                  <div className="text-primary mb-1 flex items-center gap-2 text-xs font-medium">
                    <Reply className="h-3 w-3" />
                    Admin Reply
                  </div>
                  <p className="text-sm leading-relaxed">{t.reply}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
