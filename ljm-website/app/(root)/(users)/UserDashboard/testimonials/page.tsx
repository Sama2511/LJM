"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitTestimonial } from "@/actions/testimonials";
import { Suspense } from "react";

const testimonialSchema = z.object({
  comment: z.string().min(10, "Testimonial must be at least 10 characters"),
});

type TestimonialForm = z.infer<typeof testimonialSchema>;

function TestimonialFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("eventId") || "";
  const eventTitle = searchParams.get("eventTitle") || "Event";

  const form = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { comment: "" },
  });

  async function onSubmit(data: TestimonialForm) {
    try {
      await submitTestimonial({
        eventId,
        eventTitle,
        comment: data.comment,
      });

      toast.success("Thank you for your testimonial!");
      form.reset();
      router.push("/UserDashboard");
    } catch (error) {
      console.error("Testimonial submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-xl px-4">
      <h1 className="mb-2 text-2xl font-semibold">Leave a Testimonial</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Share your experience volunteering at{" "}
        <span className="font-medium">{eventTitle}</span>
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          placeholder="Share your experience with this event..."
          className="min-h-30"
          {...form.register("comment")}
        />
        {form.formState.errors.comment && (
          <p className="text-destructive text-sm">
            {form.formState.errors.comment.message}
          </p>
        )}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Submit Testimonial"}
        </Button>
      </form>
    </div>
  );
}

export default function NewTestimonialPage() {
  return (
    <Suspense>
      <TestimonialFormContent />
    </Suspense>
  );
}
