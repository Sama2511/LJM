import React from "react";

export default function Page() {
  return (
    <>
      <div className="font-chillax flex w-full flex-col items-center text-gray-900">
        <div className="mt-15 mb-30 text-center">
          <h1 className="text-foreground font-serif text-5xl font-bold sm:text-6xl lg:text-7xl">
            Services
          </h1>
          <h2 className="mt-4 text-xl text-gray-600">
            Community-Led Care for Life's Final Chapter
          </h2>
        </div>

        {/* SECTION 1 */}
        <div className="border-muted-foreground mb-12 flex w-10/12 flex-col items-center justify-between gap-10 lg:mb-0 lg:flex-row lg:gap-0 lg:border-t-4 lg:border-r-4 lg:border-b-4 lg:py-10">
          <img
            src="/servicePic.jpg"
            alt="Advanced Care Planning"
            className="h-[400px] w-full rounded-xl object-cover shadow-lg lg:w-1/2"
          />
          <div className="lg:w-1/2 lg:pr-10 lg:pl-10">
            <h3 className="mb-4 text-3xl font-bold text-green-800">
              Advanced Care Planning
            </h3>
            <p className="text-foreground text-lg leading-relaxed">
              We believe that every individual deserves to have their
              end-of-life wishes respected and honoured. Our Advanced Care
              Planning services help patients and their families make informed
              decisions about care preferences, treatments, and quality of life
              goals. Our caring professionals provide guidance, support, and
              resources for creating personalised care plans that reflect unique
              values and beliefs.
            </p>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="border-muted-foreground mb-12 flex w-10/12 flex-col items-center justify-between gap-10 lg:mb-0 lg:flex-row lg:gap-0 lg:border-b-4 lg:border-l-4 lg:pt-10 lg:pb-10">
          <div className="lg:w-1/2 lg:pr-10 lg:pl-10">
            <h3 className="mb-4 text-3xl font-bold text-green-800">
              Compassionate Communities
            </h3>
            <p className="text-foreground text-lg leading-relaxed">
              Compassionate Communities empower people and organizations to
              support those facing advanced illness, dying, or grief. Through
              compassion and education, we normalize conversations about death
              and create spaces of empathy and care. Our programs connect
              healthcare providers, families, and communities to foster
              understanding and resilience.
            </p>
          </div>
          <img
            src="/compassionate.png"
            alt="Compassionate Communities"
            className="h-[400px] w-full rounded-xl object-cover shadow-lg lg:w-1/2"
          />
        </div>

        {/* SECTION 3 */}
        <div className="border-muted-foreground mb-12 flex w-10/12 flex-col items-center justify-between gap-10 lg:flex-row lg:gap-0 lg:border-r-4 lg:border-b-4 lg:pt-10 lg:pb-10">
          <img
            src="/Rectangle120.png"
            alt="Death Cafes"
            className="h-[400px] w-full rounded-xl object-cover shadow-lg lg:w-1/2"
          />
          <div className="lg:w-1/2 lg:pl-10">
            <h3 className="mb-4 text-3xl font-bold text-green-800">
              Death Cafes
            </h3>
            <p className="text-foreground text-lg leading-relaxed">
              Death Cafes provide a safe and informal space for open
              conversations about death and life. By talking freely, people can
              reduce fear and anxiety and find connection, insight, and peace.
              Our sessions are respectful, inclusive, and deeply meaningful.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
