"use client";

import { DeleteArticle } from "@/actions/articles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, Trash2 } from "lucide-react";
import { useState } from "react";
import EditArticleForm from "./EditArticleForm";
import Image from "next/image";

type Props = {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  created_at: string;
};

export default function DashArticleCard({
  id,
  title,
  content,
  image_url,
  created_at,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await DeleteArticle(id);
    setIsDeleting(false);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
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
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">{formatDate(created_at)}</span>
          </div>
          <p className="text-foreground/80 line-clamp-4 text-base">{content}</p>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-6 pt-2 pb-6 font-semibold">
        <EditArticleForm id={id} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Delete
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Delete
                </span>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                article.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button asChild variant="destructive" onClick={handleDelete}>
                <AlertDialogAction>Delete</AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
