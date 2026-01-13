"use client";

import { useState } from "react";
import Link from "next/link";

export default function DonatePage() {
  const [selected, setSelected] = useState(10); // default selected option

  const donationOptions = [
    {
      amount: 10,
      title: "A Cuppa and a Chat",
      desc: "Helps host local death cafes to start gentle, vital conversations",
    },
    {
      amount: 25,
      title: "A Moment of Peace",
      desc: "Supports safe, welcoming spaces for community reflection and learning",
    },
    {
      amount: 50,
      title: "Dignity in Every Detail",
      desc: "Fund resources and guides to support caring for loved ones at homes",
    },
    {
      amount: 100,
      title: "You Are Not Alone",
      desc: "Connects Carers with trained doulas and local support networks",
    },
    {
      amount: 500,
      title: "Build the Vision",
      desc: "Drives the mission to establish community hospice in yanchep and two rocks",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-chillax text-foreground mb-10 text-center text-3xl font-bold">
          Make a difference Today
        </h1>

        <p className="text-muted-foreground mb-4 text-left text-[18px] font-semibold">
          Select your donation amount
        </p>

        {/* Donation Cards */}
        <div className="flex flex-col gap-4">
          {donationOptions.map((opt) => (
            <DonationCard
              key={opt.amount}
              amount={opt.amount}
              title={opt.title}
              desc={opt.desc}
              selected={selected === opt.amount}
              onClick={() => setSelected(opt.amount)}
            />
          ))}
        </div>
        <div className="mt-4 flex w-full gap-3">
          <div className="flex-2">
            <input
              type="number"
              placeholder="Custom Amount"
              className="h-[50px] w-full rounded-xl border p-3"
            />
          </div>

          <div className="flex-1">
            <select className="h-[50px] w-full rounded-xl border p-3">
              <option>Frequency</option>
              <option>One-Time</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>
        </div>

        {/* Donate Button */}
        <Link href="/donation/details/">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 w-1/3 rounded-lg py-4 text-lg font-semibold shadow transition">
            Donate
          </button>
        </Link>
      </div>
    </div>
  );
}

/* Donation Card Component */
function DonationCard({ amount, title, desc, selected, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex w-full cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${selected ? "bg-accent" : "bg-background hover:bg-muted"} `}
    >
      <div className="text-primary min-w-[60px] text-xl font-bold">
        ${amount}
      </div>
      <div>
        <p className="text-foreground font-semibold">{title}</p>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </div>
    </div>
  );
}
