import React from "react";

export default function Page() {
  return (
    <>
      <div className="flex w-full flex-col items-center text-gray-900">
        {/* Заголовок страницы */}
        <div className="mt-10 mb-20 text-center">
          <h1 className="text-foreground font-serif text-5xl font-bold sm:text-6xl lg:text-7xl">
            Services
          </h1>
          <h2 className="mt-4 text-xl text-gray-600">
            Community-Led Care for Life's Final Chapter
          </h2>
        </div>

        {/* SECTION 1 */}
        <div className="mb-24 flex w-10/12 flex-col items-center justify-between gap-10 lg:flex-row">
          <img
            src="/servicePic.jpg"
            alt="Advanced Care Planning"
            className="h-[400px] w-full rounded-xl object-cover shadow-lg lg:w-1/2"
          />
          <div className="lg:w-1/2 lg:pl-10">
            <h3 className="mb-4 text-3xl font-bold text-green-800">
              Advanced Care Planning
            </h3>
            <p className="text-lg leading-relaxed text-gray-700">
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
        <div className="mb-24 flex w-10/12 flex-col-reverse items-center justify-between gap-10 lg:flex-row">
          <div className="lg:w-1/2 lg:pr-10">
            <h3 className="mb-4 text-3xl font-bold text-green-800">
              Compassionate Communities
            </h3>
            <p className="text-lg leading-relaxed text-gray-700">
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
        <div className="mb-24 flex w-10/12 flex-col items-center justify-between gap-10 lg:flex-row">
          <img
            src="/Rectangle120.png"
            alt="Death Cafes"
            className="h-[400px] w-full rounded-xl object-cover shadow-lg lg:w-1/2"
          />
          <div className="lg:w-1/2 lg:pl-10">
            <h3 className="mb-4 text-3xl font-bold text-green-800">
              Death Cafes
            </h3>
            <p className="text-lg leading-relaxed text-gray-700">
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
