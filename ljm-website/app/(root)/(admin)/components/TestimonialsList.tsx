"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

interface Testimonial {
  id: string;
  user_name: string;
  comment: string;
  reply?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function TestimonialsList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true);

      // MOCK DATA
      const data: Testimonial[] = [
        {
          id: "1",
          user_name: "Carlos Esma",
          comment: "Had a great time!",
          status: "approved",
          created_at: new Date().toISOString(),
        },
      ];

      setTestimonials(data);
      setLoading(false);
    }

    fetchTestimonials();
  }, []);

  const handleReplyClick = (id: string, currentReply?: string) => {
    setReplyingId(id);
    setReplyText(currentReply || "");
  };

  const handleReplySubmit = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              reply: replyText,
              status: "approved", // or leave status as-is
            }
          : t
      )
    );
    setReplyingId(null);
    setReplyText("");
  };

  if (loading) return <Spinner />;

  if (testimonials.length === 0)
    return <p className="text-center text-muted-foreground mt-10">No testimonials submitted yet.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.id} className="p-4 shadow-md">
          <CardContent>
            <p className="font-semibold">{t.user_name}</p>
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
                  placeholder="Type your reply..."
                />
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={() => handleReplySubmit(t.id)}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setReplyingId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <p className="mt-2 text-xs text-muted-foreground">
              Submitted: {new Date(t.created_at).toLocaleDateString()}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Status: {t.status}
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
