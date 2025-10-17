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
    <nav className="bg-[#3e5f44] p-4 text-white">
      <div className="flex justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="" height={300} width={300} />
        </Link>
        <Link href="/donate">
          <Button className="flex h-10 w-35 cursor-pointer items-center justify-center rounded-[6px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 px-[1px] py-[1px] hover:bg-gradient-to-l">
            <div className="flex h-full w-full items-center justify-center rounded-[5px] bg-[#5e936c] text-[20px] font-medium">
              Donate
            </div>
          </Button>
        </Link>
      </div>
      <ul className="mt-2 hidden cursor-pointer justify-center gap-5 text-lg font-semibold text-white sm:flex">
        <li>
          <Link href="" /> Home
        </li>
        <li>
          <Link href="" /> About Us
        </li>
        <li>
          <Link href="" /> Services
        </li>
        <li>
          <Link href="" /> Events
        </li>
        <li>
          <Link href="" /> Crew
        </li>
        <li>
          <Link href="" /> Acrticles
        </li>
        <li>
          <Link href="" /> Contact us
        </li>
      </ul>
      <div
        onClick={handleNav}
        className="flex cursor-pointer items-center justify-end md:hidden"
      >
        <Menu width={30} height={30} className="text-black" />
      </div>
      <div
        className={
          isOpen
            ? "fixed top-0 left-0 h-screen w-[65%] bg-black p-10 duration-500 ease-in sm:hidden"
            : "fixed top-0 left-[-100%] h-screen p-10 duration-500 ease-in"
        }
      >
        <div className="flex w-full items-center justify-end">
          <div onClick={handleNav} className="cursor-pointer">
            <X />
          </div>
        </div>

        <ul className="flex flex-col gap-5 pt-10">
          <li onClick={handleNav} className="">
            <Link href="" /> Home
          </li>
          <li onClick={handleNav}>
            <Link href="" /> About Us
          </li>
          <li onClick={handleNav}>
            <Link href="" /> Services
          </li>
          <li onClick={handleNav}>
            <Link href="" /> Events
          </li>
          <li onClick={handleNav}>
            <Link href="" /> Crew
          </li>
          <li onClick={handleNav}>
            <Link href="" /> Acrticles
          </li>
          <li onClick={handleNav}>
            <Link href="" /> Contact us
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Header;
