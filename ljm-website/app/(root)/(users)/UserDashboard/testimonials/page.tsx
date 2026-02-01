"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitTestimonial } from "@/actions/testimonials";

const testimonialSchema = z.object({
  comment: z.string().min(10, "Testimonial must be at least 10 characters"),
});

type TestimonialForm = z.infer<typeof testimonialSchema>;

export default function NewTestimonialPage() {
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
      router.push("/UserDashboard"); // redirect to dashboard
    } catch (error) {
      console.error("Testimonial submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-xl">
      <h1 className="mb-4 text-2xl font-semibold">Leave a Testimonial</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Textarea
          placeholder="Share your experience with this event..."
          {...form.register("comment")}
        />
        {form.formState.errors.comment && (
          <p className="text-sm text-red-500">
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
