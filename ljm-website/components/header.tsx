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
    <nav className="@container bg-[#3e5f44] p-4 text-white">
      <div className="flex flex-col items-center gap-5 @[600]:flex-row @[600]:justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt=""
            height={300}
            width={300}
            className="w-[350px] @[600]:w-[400px] @[1100]:w-[500px]"
          />
        </Link>
        <Link href="/donate">
          <Button className="flex h-11 w-35 cursor-pointer items-center justify-center rounded-[6px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 px-[1px] py-[1px] hover:bg-gradient-to-l @[600]:h-13 @[600]:w-40">
            <div className="flex h-full w-full items-center justify-center rounded-[5px] bg-[#5e936c] text-[20px] font-medium @[600]:text-[25px]">
              Donate
            </div>
          </Button>
        </Link>
      </div>
      <ul className="hidden justify-center gap-2 pt-5 pb-2 text-[19px] font-semibold text-[#f8f5f0] @[600]:flex @[800]:gap-4 @[800]:text-[20px] @[1100]:gap-4 @[1100]:text-[22px]">
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
        onClick={handleNav}
        className="flex cursor-pointer items-center justify-end @[600]:hidden"
      >
        <Menu width={30} height={30} className="fixed top-23 text-gray-400" />
      </div>
      <div
        className={
          isOpen
            ? "fixed top-0 left-0 h-screen w-[65%] bg-black p-10 duration-500 ease-in sm:hidden"
            : "fixed top-0 left-[-100%] h-screen w-full p-10 duration-500 ease-in"
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
