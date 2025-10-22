"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AboutUspage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="@container flex justify-center p-5">
      <div className="grid auto-cols-[minmax(250px,350px)] auto-rows-min gap-5 md:auto-cols-[350px] @[700px]:grid-cols-2 @[700px]:grid-rows-4">
        <div className="col-span-1 w-full space-y-3 rounded-3xl bg-[#e2ddb4] p-5 text-center @[700px]:hidden">
          <h1 className="text-2xl font-semibold text-[#3E5F44]">
            Our Origin story
          </h1>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-none" : "max-h-40"
            }`}
          >
            <p>
              LJM Memorial Hospice exissts because of the way our community
              showed up when it mattered most. When my husband Liam was dying of
              brain cancer, it was the people around us—friends, neighbours,
              even strangers—who held us together. Their kindness, meals, care
              for our kids, quiet support… it gave us strength. But not everyone
              has that. And even with all that love, we still didn't have a
              space that let us stay close as a family in those final days. LJM
              Memorial Hospice is our way of giving that back. It's a place
              where care isn't limited in anyway, but woven through connection,
              compassion, and community. Because no one should face the end
              alone—and everyone deserves to be held with dignity, comfort, and
              love.
            </p>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mx-auto flex items-center gap-1 text-sm font-medium text-[#3E5F44] transition-colors hover:text-[#2a4230]"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Show less" : "Show more"}
          >
            {isOpen ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
        <div className="col-span-2 hidden w-full space-y-3 rounded-3xl bg-[#e2ddb4] p-5 text-center @[700px]:block">
          <h1 className="text-2xl font-semibold text-[#3E5F44]">
            Our Origin story
          </h1>
          <p>
            LJM Memorial Hospice exissts because of the way our community showed
            up when it mattered most. When my husband Liam was dying of brain
            cancer, it was the people around us—friends, neighbours, even
            strangers—who held us together. Their kindness, meals, care for our
            kids, quiet support… it gave us strength. But not everyone has that.
            And even with all that love, we still didn't have a space that let
            us stay close as a family in those final days. LJM Memorial Hospice
            is our way of giving that back. It's a place where care isn't
            limited in anyway, but woven through connection, compassion, and
            community. Because no one should face the end alone—and everyone
            deserves to be held with dignity, comfort, and love.
          </p>
        </div>
        <div className="row-span-2 h-[800px] overflow-hidden rounded-3xl bg-black">
          <img
            src="/aboutPic1.png"
            alt="About us"
            className="block h-full w-full object-cover"
          />
        </div>
        <div className="w-full space-y-3 rounded-3xl bg-[#A2AF9B] p-5 text-center">
          <h1 className="text-2xl font-semibold text-[#3E5F44]">Our Vision</h1>
          <p>
            "Empathetic, humane and family-oriented not-for-profit hospice care
            for people of all demographics." We know the impact that poor
            quality end of life care can have on the health of the patient as
            well as their family. Through our work, we intend to contribute to a
            more positive end of life experience for the WA community.
          </p>
        </div>
        <div className="w-full space-y-3 rounded-3xl bg-[#D3DAD9] p-5 text-center">
          <h1 className="text-2xl font-semibold text-[#3E5F44]">Our mission</h1>
          <p>
            LJM Memorial Hospice was established in 2018 by Kate McLaughlin.
            Kate wanted to find a way to give back to the WA community after
            they had provided so much support to her husband Liam when he
            developed a brain tumor.
          </p>
        </div>
        <img src="/aboutPic2.png" className="rounded-3xl" alt="About us" />
        <div className="w-full space-y-3 rounded-3xl bg-[#D6DAC8] p-5 text-center">
          <h1 className="text-2xl font-semibold text-[#3E5F44]">About Us</h1>
          <p>
            LJM Memorial Hospice was established in 2018 by Kate McLaughlin.
            Kate wanted to find a way to give back to the WA community after
            they had provided so much support to her husband Liam when he
            developed a brain tumor.
          </p>
        </div>
      </div>
    </section>
  );
}
