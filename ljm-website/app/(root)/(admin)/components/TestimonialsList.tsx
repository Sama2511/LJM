"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/app/utils/server"; // server-side Supabase client

interface Testimonial {
  id: string;
  user_name: string;
  event_title: string;
  comment: string;
  reply?: string;
  created_at: string;
}

export default function TestimonialsList({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleReplyClick = (id: string, currentReply?: string) => {
    setReplyingId(id);
    setReplyText(currentReply || "");
  };

  const handleReplySubmit = async (id: string) => {
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from("testimonials")
        .update({ reply: replyText })
        .eq("id", id);

      if (error) throw error;

      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                reply: replyText,
              }
            : t
        )
      );

      setReplyingId(null);
      setReplyText("");
    } catch (error) {
      console.error("Failed to submit reply:", error);
      alert("Failed to submit reply. Try again.");
    }
  };

  if (!testimonials || testimonials.length === 0)
    return <p className="text-center text-muted-foreground mt-10">No testimonials submitted yet.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.id} className="p-4 shadow-md">
          <CardContent>
            <p className="font-semibold">{t.user_name}</p>
            <p className="mt-1 text-sm text-muted-foreground">Event: {t.event_title}</p>
            <p className="mt-2">{t.comment}</p>

            {t.reply && replyingId !== t.id && (
              <p className="mt-2 text-blue-600">
                <strong>Admin Reply:</strong> {t.reply}
              </p>
            )}

            {replyingId === t.id && (
              <div className="mt-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply (optional)..."
                />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => handleReplySubmit(t.id)}>
                    Save Reply
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setReplyingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <p className="mt-2 text-xs text-muted-foreground">
              Submitted: {new Date(t.created_at).toLocaleString()}
            </p>
          </CardContent>
          <CardFooter>
            {replyingId !== t.id && (
              <Button size="sm" onClick={() => handleReplyClick(t.id, t.reply)}>
                Reply
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
