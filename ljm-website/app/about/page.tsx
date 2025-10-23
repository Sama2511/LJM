"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import ProfileCard from "@/components/ProfileCard";

export default function AboutUspage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <section className="@container mt-10 flex justify-center p-5">
        <div className="gap- grid w-full max-w-[350px] gap-2 font-[700] @[700px]:max-w-[750px] @[700px]:grid-cols-2">
          <div className="w-full space-y-3 rounded-3xl bg-[#e2ddb4] p-5 text-center @[700px]:col-span-2">
            <h1 className="text-3xl font-semibold text-[#3E5F44]">
              Our Origin story
            </h1>
            <div
              className={`overflow-hidden transition-all duration-300 @[700px]:max-h-none ${
                isOpen ? "max-h-none" : "max-h-40"
              }`}
            >
              <p>
                LJM Memorial Hospice exists because of the way our community
                showed up when it mattered most. When my husband Liam was dying
                of brain cancer, it was the people around us—friends,
                neighbours, even strangers—who held us together. Their kindness,
                meals, care for our kids, quiet support… it gave us strength.
                But not everyone has that. And even with all that love, we still
                didn't have a space that let us stay close as a family in those
                final days. LJM Memorial Hospice is our way of giving that back.
                It's a place where care isn't limited in anyway, but woven
                through connection, compassion, and community. Because no one
                should face the end alone—and everyone deserves to be held with
                dignity, comfort, and love.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mx-auto flex items-center gap-1 text-sm font-medium text-[#3E5F44] transition-colors hover:text-[#2a4230] @[700px]:hidden"
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

          <div className="relative h-[300px] w-full">
            <Image
              src="/dummy-image-square 10.png"
              alt="About us"
              className="rounded-3xl object-cover"
              fill
            />
          </div>

          <div className="flex w-full flex-col justify-center space-y-3 rounded-3xl bg-[#A2AF9B] p-5 text-center">
            <h1 className="text-3xl font-semibold text-[#3E5F44]">
              Our Vision
            </h1>
            <p>
              "Empathetic, humane and family-oriented not-for-profit hospice
              care for people of all demographics." We know the impact that poor
              quality end of life care can have on the health of the patient as
              well as their family. Through our work, we intend to contribute to
              a more positive end of life experience for the WA community.
            </p>
          </div>

          <div className="flex w-full flex-col justify-center space-y-3 rounded-3xl bg-[#D3DAD9] p-5 text-center">
            <h1 className="text-3xl font-semibold text-[#3E5F44]">
              Our mission
            </h1>
            <p>
              LJM Memorial Hospice was established in 2018 by Kate McLaughlin.
              Kate wanted to find a way to give back to the WA community after
              they had provided so much support to her husband Liam when he
              developed a brain tumor.
            </p>
          </div>

          <div className="relative h-[300px] w-full">
            <Image
              src="/aboutPic2.png"
              alt="About us"
              className="rounded-3xl object-cover"
              fill
            />
          </div>

          <div className="w-full space-y-3 rounded-3xl bg-[#D6DAC8] p-5 text-center @[700px]:col-span-2">
            <h1 className="text-3xl font-semibold text-[#3E5F44]">About Us</h1>
            <p>
              LJM Memorial Hospice was established in 2018 by Kate McLaughlin.
              Kate wanted to find a way to give back to the WA community after
              they had provided so much support to her husband Liam when he
              developed a brain tumor.
            </p>
          </div>
        </div>
      </section>

      <div
        className="h-50 bg-gradient-to-b from-[#F8F5F0] via-[#F8F5F0] to-[#ebe0cd]"
        aria-hidden="true"
      >
        <div className="container mx-auto py-16"></div>
      </div>
      {/* gradient background */}
      <section className="flex flex-col items-center gap-4 bg-[#ebe0cd]">
        <h1 className="font-serif text-5xl font-bold text-[#157A4E] sm:text-7xl lg:text-8xl">
          Our Values
        </h1>
        <h2 className="text-center text-xl">
          These four values guide every decision we make
        </h2>
        <section className="container mx-auto px-6 py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2">
            {/* Item 1 */}
            <div className="border-b border-gray-300 p-6 md:border-r md:border-b">
              <h3 className="mb-3 text-2xl font-semibold text-[#3E5F44]">
                Connection
              </h3>
              <p className="text-gray-700">
                From child to elder, patient to family member, nurse to
                volunteer—everyone belongs. We design spaces and experiences
                that encourage togetherness.
              </p>
            </div>

            {/* Item 2 */}
            <div className="border-b border-gray-300 p-6 md:border-b">
              <h3 className="mb-3 text-2xl font-semibold text-[#3E5F44]">
                Choice{" "}
              </h3>
              <p className="text-gray-700">
                End-of-life care should reflect the values and wishes of the
                individual. We advocate for more options—spaces that feel like
                home, moments shared with loved ones, and the freedom to shape
                this time in a way that feels right.
              </p>
            </div>

            {/* Item 3 */}
            <div className="border-b border-gray-300 p-6 md:border-r md:border-b-0">
              <h3 className="mb-3 text-2xl font-semibold text-[#3E5F44]">
                Community{" "}
              </h3>
              <p className="text-gray-700">
                We believe healing and comfort are made possible through human
                connection. Our community is at the heart of everything—our
                supporters, volunteers, neighbours, and the families we serve.
              </p>
            </div>

            {/* Item 4 */}
            <div className="p-6">
              <h3 className="mb-3 text-2xl font-semibold text-[#3E5F44]">
                Dignity{" "}
              </h3>
              <p className="text-gray-700">
                Every person deserves to feel seen, heard, and valued—especially
                at the end of life. We prioritise respect, gentleness, and care
                for all.
              </p>
            </div>
          </div>
        </section>
      </section>
      {/* gradient background */}
      <div
        className="h-50 bg-gradient-to-t from-[#F8F5F0] via-[#F8F5F0] to-[#ebe0cd]"
        aria-hidden="true"
      >
        <div className="container mx-auto py-16"></div>
      </div>
      <section className="container mx-auto px-6 py-12">
        <h1 className="mb-12 text-center font-serif text-5xl font-bold text-[#157A4E] sm:text-7xl lg:text-8xl">
          Meet Our Team
        </h1>
        <div className="grid">
          <ProfileCard member="Oussama Hassoune" role="CEO" imageUrl="" />
          <ProfileCard member="Oussama Hassoune" role="CEO" imageUrl="" />
          <ProfileCard member="Oussama Hassoune" role="CEO" imageUrl="" />
          <ProfileCard member="Oussama Hassoune" role="CEO" imageUrl="" />
          <ProfileCard member="Oussama Hassoune" role="CEO" imageUrl="" />
        </div>
      </section>
    </div>
  );
}
