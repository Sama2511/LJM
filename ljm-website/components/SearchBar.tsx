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
    <>
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center"
      >
        <Search style={{ width: 22, height: 22 }} />
        <input
          className="w-[200px] cursor-pointer"
          placeholder="Search events,articles..."
        />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList></CommandList>
      </CommandDialog>
    </>
  );
}
