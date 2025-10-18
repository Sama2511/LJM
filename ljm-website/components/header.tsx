"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { X } from "lucide-react";

function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="@container flex flex-col bg-[#3e5f44] p-4 text-white">
      <div className="flex items-center justify-between gap-5 @[600]:flex-row @[1000]:mx-auto @[1000]:w-full @[1000]:max-w-[90%] @[1200]:max-w-[80%]">
        <Link href="/">
          <Image
            src="/logo.png"
            alt=""
            height={300}
            width={300}
            className="w-[190px] @[600]:w-[300px] @[1100]:w-[350px]"
          />
        </Link>
        <div className="flex items-center gap-5">
          <Button asChild>
            <Link href="/donate" className="border-[1px] border-white">
              <span className="flex items-center justify-center bg-[#5e936c] py-0 text-[14px]">
                Donate
              </span>
            </Link>
          </Button>
          <div
            onClick={handleNav}
            className="flex cursor-pointer items-center justify-end @[600]:hidden"
          >
            <Menu width={30} height={30} className="text-gray-400" />
          </div>
        </div>
      </div>
      <ul className="hidden justify-center gap-2 pt-2 font-semibold text-[#f8f5f0] @[600]:flex @[600]:text-[14px] @[800]:gap-3 @[800]:text-[14px] @[1100]:gap-4 @[1100]:text-[16px]">
        <li className="cursor-pointer">
          <Link href="" /> Home
        </li>
        |
        <li className="cursor-pointer">
          <Link href="" /> About Us
        </li>
        |
        <li className="cursor-pointer">
          <Link href="" /> Services
        </li>
        |
        <li className="cursor-pointer">
          <Link href="" /> Events
        </li>
        |
        <li className="cursor-pointer">
          <Link href="" /> Crew
        </li>
        |
        <li className="cursor-pointer">
          <Link href="" /> Acrticles
        </li>
        |
        <li className="cursor-pointer">
          <Link href="" /> Contact us
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
          <li onClick={handleNav} className="cursor-pointer">
            <Link href="" /> Home
          </li>
          <li onClick={handleNav} className="cursor-pointer">
            <Link href="" /> About Us
          </li>
          <li onClick={handleNav} className="cursor-pointer">
            <Link href="" /> Services
          </li>
          <li onClick={handleNav} className="cursor-pointer">
            <Link href="" /> Events
          </li>
          <li onClick={handleNav} className="cursor-pointer">
            <Link href="" /> Crew
          </li>
          <li onClick={handleNav} className="cursor-pointer">
            <Link href="" /> Acrticles
          </li>
          <li onClick={handleNav} className="cursor-pointer">
            <Link href="" /> Contact us
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Header;
