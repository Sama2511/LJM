"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const handleNav = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Events", href: "/events" },
    { name: "Crew", href: "/crew" },
    { name: "Articles", href: "/articles" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-4 z-50 px-4">
      {/* Container card */}
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 rounded-3xl border border-[#ff8200] bg-[#f6f2e9] px-6 py-4 shadow-md">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/kindlewood_logo.png"
            alt="Kindlewood Logo"
            width={350}
            height={55}
            className="w-[220px] @[600]:w-[250px] @[900]:w-[280px] @[1200]:w-[320px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-[#ff8200] text-white" : "text-[#3b3b3b] hover:bg-[#ffe4cc]"} `}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Search & Donate */}
        <div className="flex items-center gap-2">
          <SearchBar />

          <Button className="rounded-full bg-[#ff8200] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#ff9b3a]">
            Donate
          </Button>

          {/* Mobile menu toggle */}
          <div
            onClick={handleNav}
            className="flex cursor-pointer items-center justify-end md:hidden"
          >
            <Menu width={28} height={28} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 z-10 h-screen w-[65%] bg-[#f6f2e9] p-6 transition-transform duration-500 ease-in-out ${
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
                key={link.href}
                href={link.href}
                onClick={handleNav}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-[#ff8200] text-white" : "text-[#3b3b3b] hover:bg-[#ffe4cc]"} `}
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
