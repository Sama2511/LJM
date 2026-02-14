// components/TestimonialsList.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateTestimonialReply } from "@/actions/admin-testimonials";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Calendar, MessageSquare, Reply } from "lucide-react";

interface Testimonial {
  id: string;
  user_name: string;
  event_title: string;
  comment: string;
  reply?: string;
  created_at: string;
}

// Client Component for better interactivity
export default function TestimonialsList({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!initialTestimonials || initialTestimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-center text-muted-foreground text-lg">
          No testimonials submitted yet.
        </p>
      </div>
    );
  }

  const handleSubmit = async (testimonialId: string, formData: FormData) => {
    setLoadingId(testimonialId);
    try {
      const reply = formData.get("reply")?.toString() || "";
      if (!reply.trim()) {
        toast.error("Reply cannot be empty");
        return;
      }
      
      await updateTestimonialReply(testimonialId, reply);
      toast.success("Reply saved successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save reply");
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">
          All Testimonials ({initialTestimonials.length})
        </h2>
        <p className="text-muted-foreground">
          Review and respond to volunteer testimonials
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {initialTestimonials.map((t) => (
          <Card key={t.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-lg">{t.user_name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{t.event_title}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {/* User Comment */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Testimonial:
                </p>
                <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">
                  "{t.comment}"
                </p>
              </div>

              {/* Existing Reply Display */}
              {t.reply && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Reply className="h-3 w-3 text-primary" />
                    <p className="text-sm font-medium text-primary">Admin Reply:</p>
                  </div>
                  <p className="text-sm leading-relaxed bg-primary/5 p-3 rounded-md border border-primary/20">
                    {t.reply}
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Submitted: {new Date(t.created_at).toLocaleDateString()} at{" "}
                {new Date(t.created_at).toLocaleTimeString()}
              </p>
            </CardContent>

            <CardFooter className="pt-0">
              <form
                className="w-full space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSubmit(t.id, formData);
                }}
              >
                <Textarea
                  name="reply"
                  placeholder={t.reply ? "Update your reply..." : "Write a reply..."}
                  defaultValue={t.reply || ""}
                  className="min-h-[80px] resize-none"
                  disabled={loadingId === t.id}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loadingId === t.id}
                >
                  {loadingId === t.id 
                    ? "Saving..." 
                    : t.reply 
                      ? "Update Reply" 
                      : "Send Reply"
                  }
                </Button>
              </form>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}