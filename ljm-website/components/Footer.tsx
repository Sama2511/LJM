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
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
          {/* leftSide */}
          <div className="flex flex-col items-start">
            <div className="mb-6 flex flex-col items-start">
              <div className="mb-2 flex items-center gap-3">
                <Link href="/">
                  <Image
                    src="/KindlewoodNewLogo.png"
                    alt=""
                    height={300}
                    width={300}
                    className="w-[280px] @[600]:w-[300px] @[1100]:w-[350px]"
                  />
                </Link>
              </div>
              <p className="text-md text-sidebar-foreground/70">
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
                  className="hover:text-sidebar-accent transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Instagram page"
                  className="hover:text-sidebar-accent transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Twitter page"
                  className="hover:text-sidebar-accent transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>

            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
              aria-label="Scroll to top"
            >
              Back to Top
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-fit">
            <h3 className="text-sidebar-accent mb-4 text-xl">Site Map</h3>
            <nav aria-label="Footer navigation">
              <ul className="flex-col space-y-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-sidebar-accent transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-sidebar-accent transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-sidebar-accent transition-colors"
                  >
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="hover:text-sidebar-accent transition-colors"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-sidebar-accent transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donate"
                    className="hover:text-sidebar-accent transition-colors"
                  >
                    Donate
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="border-sidebar-border text-sidebar-foreground/70 mt-8 border-t pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Kindlewood. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
