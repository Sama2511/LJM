import React from "react";

export default function page() {
  return (
    <section className="flex justify-center p-5">
      <div className="grid auto-cols-[minmax(250px,350px)] grid-rows-1 gap-5 md:auto-cols-[350px] md:grid-cols-2">
        <div className="col-span-1 w-full space-y-3 rounded-3xl bg-[#e2ddb4] p-5 text-center">
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
        <img src="/aboutPic1.png" className="rounded-3xl" />
        <div className="w-full space-y-3 rounded-3xl bg-[#A2AF9B] p-5 text-center">
          <h1 className="text-2xl font-semibold text-[#3E5F44]">Our Vision</h1>
          <p>
            “Empathetic, humane and family-oriented not-for-profit hospice care
            for people of all demographics.” We know the impact that poor
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
        <img src="/aboutPic2.png" className="rounded-3xl" />
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
