"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Menu, Search } from "lucide-react";
import { X } from "lucide-react";
import { Card } from "./ui/card";
import SearchBar from "./SearchBar";

function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="@container sticky top-0 z-50 bg-[#3e5f44] p-4 text-white">
      <div className="flex items-center justify-between gap-5 @[600]:flex-row @[1000]:mx-auto @[1000]:w-full @[1000]:max-w-[90%] @[1200]:max-w-[80%]">
        <Link href="/">
          <Image
            src="/logo.png"
            alt=""
            height={300}
            width={300}
            className="w-[280px] @[600]:w-[300px] @[1100]:w-[350px]"
          />
        </Link>
        <SearchBar />

        <div className="flex items-center gap-5">
          <div className="animate-rotate-border from-primary to-primary w-full max-w-sm cursor-pointer rounded-lg bg-conic-[from_var(--border-angle)] from-80% via-white via-90% to-100% p-px">
            <Button className="border-primary bg-primary rounded-lg border px-4 text-center font-mono text-[16px] font-bold @[600]:px-10 @[600]:text-[22px]">
              Donate
            </Button>
          </div>

          <div
            onClick={handleNav}
            className="flex cursor-pointer items-center justify-end @[600]:hidden"
          >
            <Menu width={30} height={30} className="text-gray-400" />
          </div>
        </div>
      </div>
      <ul className="hidden justify-center gap-2 pt-2 font-semibold text-[#f8f5f0] @[600]:flex @[600]:text-[14px] @[800]:gap-3 @[800]:text-[14px] @[1100]:gap-4 @[1100]:text-[16px]">
        <li className="cursor-pointer hover:text-green-200">
          <Link href="/"> Home</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-green-200">
          <Link href="/about"> About Us</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-green-200">
          <Link href="/services"> Services</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-green-200">
          <Link href="/events"> Events </Link>
        </li>
        |
        <li className="cursor-pointer hover:text-green-200">
          <Link href="/crew"> Crew </Link>
        </li>
        |
        <li className="cursor-pointer hover:text-green-200">
          <Link href="/articles"> Articles</Link>
        </li>
        |
        <li className="cursor-pointer hover:text-green-200">
          <Link href="/contact"> Contact us</Link>
        </li>
      </ul>

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
            <Link href="/about"> About Us</Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/services"> Services</Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/events"> Events </Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href=""> Crew </Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/articles"> Articles</Link>
          </li>
          <li
            onClick={handleNav}
            className="cursor-pointer hover:text-green-200"
          >
            <Link href="/contact"> Contact Us</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Header;
