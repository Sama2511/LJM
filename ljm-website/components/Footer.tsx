"use client";
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#3e5f44] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-start">
            <div className="mb-6 flex flex-col items-start">
              <div className="mb-2 flex items-center gap-3">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt=""
                    height={300}
                    width={300}
                    className="w-[280px] @[600]:w-[300px] @[1100]:w-[350px]"
                  />
                </Link>
              </div>
              <p className="text-md text-gray-200">
                Supporting communities with compassion
              </p>
            </div>

            <div className="mb-6">
              <h4 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook page"
                  className="transition-colors hover:text-green-200"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Instagram page"
                  className="transition-colors hover:text-green-200"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Twitter page"
                  className="transition-colors hover:text-green-200"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>

            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white text-[#3e5f44] hover:bg-gray-100"
              aria-label="Scroll to top"
            >
              Back to Top
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden lg:block">
            <h3 className="mb-4 text-xl font-bold">Get Involved</h3>
            <p className="mb-4 text-gray-200">
              Join our community and make a difference in people's lives during
              their most sacred moments.
            </p>
            <Link href="/volunteer">
              <Button
                variant="outline"
                className="bg-white text-[#3e5f44] hover:bg-gray-100"
              >
                Volunteer Now
              </Button>
            </Link>
          </div>

          <div className="md:text-right">
            <h3 className="mb-4 text-xl font-bold">Site Map</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-green-200"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-green-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="transition-colors hover:text-green-200"
                  >
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="transition-colors hover:text-green-200"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-green-200"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donate"
                    className="transition-colors hover:text-green-200"
                  >
                    Donate
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-6 text-center text-sm text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} Organization Name. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
