"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Menu, Search } from "lucide-react";
import { X } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="font-chillax @container sticky top-0 z-50 bg-[#f6f2e9] px-4 py-1.5 text-white">
      {/* Top Row: Logo, Nav Links, Search & Donate */}
      <div className="flex items-center justify-between gap-4 @[750]:mx-auto @[1000]:w-full @[1000]:max-w-[90%] @[1200]:max-w-[80%]">
        
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/kindlewood_logo.png"
            alt="Kindlewood Logo"
            width={384}
            height={64}
            className="w-[250px] @[600]:w-[280px] @[900]:w-[320px] @[1200]:w-[360px]"
          />
        </Link>

        {/* Navigation Links - Center */}
        <ul className="hidden flex-1 justify-center gap-2 font-semibold text-[#1a300d] @[900]:flex @[900]:text-[15px] @[1100]:gap-3 @[1100]:text-[14px] @[1300]:text-[15px]">
          <li className="cursor-pointer hover:text-[#ffb731]">
            <Link href="/">Home</Link>
          </li>
          |
          <li className="cursor-pointer hover:text-[#ffb731]">
            <Link href="/about">About Us</Link>
          </li>
          |
          <li className="cursor-pointer hover:text-[#ffb731]">
            <Link href="/services">Services</Link>
          </li>
          |
          <li className="cursor-pointer hover:text-[#ffb731]">
            <Link href="/events">Events</Link>
          </li>
          |
          <li className="cursor-pointer hover:text-[#ffb731]">
            <Link href="/crew">Crew</Link>
          </li>
          |
          <li className="cursor-pointer hover:text-[#ffb731]">
            <Link href="/articles">Articles</Link>
          </li>
          |
          <li className="cursor-pointer hover:text-[#ffb731]">
            <Link href="/contact">Contact us</Link>
          </li>
        </ul>

        {/* Right Side: Search & Donate */}
        <div className="flex items-center gap-2">
          <SearchBar />

          <div className="animate-rotate-border from-[#ffb731] to-[#ffb731] cursor-pointer rounded-lg bg-conic-[from_var(--border-angle)] from-80% via-white via-90% to-100% p-[2px]">
            <Button className="border-primary bg-[#ff8200] rounded-lg border px-4 text-center text-[14px] font-medium @[600]:px-6 @[600]:text-[16px]">
              Donate
            </Button>
          </div>

          <div
            onClick={handleNav}
            className="flex cursor-pointer items-center justify-end @[900]:hidden"
          >
            <Menu width={28} height={28} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Below on smaller screens */}
      <ul className="flex justify-center gap-2 pt-3 font-semibold text-[#ff8200] @[900]:hidden text-[13px]">
        <li className="cursor-pointer hover:text-black">
          <Link href="/">Home</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-black">
          <Link href="/about">About Us</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-black">
          <Link href="/services">Services</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-black">
          <Link href="/events">Events</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-black">
          <Link href="/crew">Crew</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-black">
          <Link href="/articles">Articles</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-black">
          <Link href="/contact">Contact us</Link>
        </li>
      </ul>

      {/* Mobile Drawer */}
      <div
        className={
          isOpen
            ? "fixed top-0 left-0 z-10 h-screen w-[65%] bg-black p-10 duration-500 ease-in sm:hidden"
            : "fixed top-0 left-[-100%] z-10 h-screen w-full p-10 duration-500 ease-in"
        }
      >
        <div className="flex w-full items-center justify-end">
          <div onClick={handleNav} className="cursor-pointer">
            <X />
          </div>
        </div>

        <ul className="flex flex-col gap-5 pt-10">
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/">Home</Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/about">About Us</Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/services">Services</Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/events">Events</Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/crew">Crew</Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/articles">Articles</Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
