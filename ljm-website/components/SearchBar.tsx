"use client";

import {
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

export default function SearchCommand() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden sm:flex">
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center border-1"
        variant="ghost"
      >
        <Search style={{ width: 22, height: 22 }} />
        <input
          className="text-md w-[90px] cursor-pointer"
          placeholder="Search..."
        />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList></CommandList>
      </CommandDialog>
    </div>
  );
}
