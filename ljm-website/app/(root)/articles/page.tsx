import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="@container">
      <div className="mb-20 flex flex-col items-center">
        <h1 className="mt-10 font-serif text-5xl font-bold text-[#157A4E] sm:text-6xl lg:text-7xl">
          Our Services
        </h1>
        <h2 className="mt-5 w-[700px] max-w-[90%] text-center text-xl">
          Explore our collection of articles, guides, and resources to help you
          navigate end-of-life care decisions and find support during difficult
          times.
        </h2>
      </div>
      <section className="m-auto grid w-[min(1400px,90%)] grid-cols-1 place-items-center gap-10 @[700]:grid-cols-2 @[1050]:grid-cols-3">
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </section>
    </div>
  );
}
