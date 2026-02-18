import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RejectedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <ShieldX className="text-destructive mb-4 h-16 w-16" />
      <h1 className="text-foreground mb-2 text-3xl font-semibold">
        Access Denied
      </h1>
      <p className="text-muted-foreground mb-6 max-w-md text-base">
        Your account has been suspended. If you believe this is a mistake,
        please contact us for assistance.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
