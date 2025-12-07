import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="font-chillax @container flex h-screen flex-col items-center">
      <div className="mb-20 flex flex-col items-center">
        <h1 className="text-foreground mt-10 text-4xl font-medium sm:text-6xl lg:text-7xl">
          Articles
        </h1>
        <h2 className="mt-5 max-w-[85%] text-center text-lg">
          Explore our collection of articles, guides, and resources to help you
          navigate end-of-life care decisions and find support during difficult
          times.
        </h2>
      </div>
      <section className="grid max-w-[90%] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </section>
    </div>
  );
}
