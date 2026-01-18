"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/app/utils/client";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const handleNav = () => setIsOpen(!isOpen);

  const handleCrewClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role === "admin") {
      router.push("/dashboard");
    } else {
      router.push("/UserDashboard");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Events", href: "/events" },
    { name: "Crew", href: "#", onClick: handleCrewClick },
    { name: "Articles", href: "/articles" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-4 z-50 px-4">
      {/* Container card */}
      <div className="border-muted bg-background mx-auto flex max-w-[1100px] items-center justify-between gap-4 rounded-2xl border px-6 py-3 shadow-md">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/KindlewoodNewLogo.png"
            alt="Kindlewood Logo"
            width={350}
            height={55}
            className="w-[220px] @[600]:w-[250px] @[900]:w-[280px] @[1200]:w-[320px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 text-xl md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={link.onClick}
                className={`px-4 py-2 text-[15px] font-medium transition ${isActive ? "text-primary border-primary border-b-2" : "text-foreground hover:text-primary"} `}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Search & Donate */}
        <div className="flex items-center gap-2">
          <SearchBar />

          <div className="animate-rotate-border from-accent to-accent via-accent-foreground cursor-pointer rounded-lg bg-conic-[from_var(--border-angle)] from-80% via-90% to-100% p-0.5">
            <Link href="/donation">
              <Button className="border-primary bg-primary text-accent-foreground rounded-lg border px-4 text-center text-[18px] font-semibold @[600]:px-6 @[600]:text-[14px]">
                Donate
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div
            onClick={handleNav}
            className="flex cursor-pointer items-center justify-end md:hidden"
          >
            <Menu width={28} height={28} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`bg-background fixed top-0 left-0 z-10 h-screen w-[65%] p-6 transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="mb-6 flex w-full items-center justify-end">
          <div onClick={handleNav} className="cursor-pointer">
            <X />
          </div>
        </div>

        <nav className="flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    link.onClick(e);
                  }
                  handleNav();
                }}
                className={`px-4 py-2 text-sm font-medium transition ${isActive ? "text-primary border-primary border-b-2" : "text-foreground hover:text-primary"} `}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
