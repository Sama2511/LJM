"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type Props = {
  title: string;
  content: string;
  image_url?: string | null;
  created_at?: string;
};

export default function ArticleCard({
  title,
  content,
  image_url,
  created_at,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <Card className="group bg-muted max-w-[335px] min-w-[335px] overflow-hidden rounded-2xl p-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <CardTitle>
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={image_url || "/dummy-image-square8.png"}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              fill
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute right-4 bottom-3 left-4">
              <h2 className="line-clamp-2 text-xl font-semibold text-white drop-shadow">
                {title}
              </h2>
            </div>
          </div>
        </CardTitle>

        <CardContent className="grid grid-rows-[140px_auto]">
          <div className="text-foreground space-y-3 text-sm">
            {created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">{formatDate(created_at)}</span>
              </div>
            )}
            <p className="text-foreground/80 line-clamp-4 text-base">
              {content}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-center px-6 pt-2 pb-6 font-semibold">
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            Read More
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
          </DialogHeader>

          {image_url && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              <Image
                src={image_url}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {created_at && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(created_at)}</span>
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
