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
    <div className="bg-[#F8F5F0] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">

        <h1 className="text-center text-3xl font-bold font-chillax text-[#3D7048] mb-10">
          Make a difference Today
        </h1>

        <p className="text-left text-[18px] font-semibold text-gray-700 mb-4">
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
        <div className="flex w-full gap-3 mt-4">
          <div className="flex-2">
            <input
              type="number"
              placeholder="Custom Amount"
              className="w-full h-[50px] p-3 border rounded-xl"
            />
          </div>

          <div className="flex-1">
            <select className="w-full h-[50px] p-3 border rounded-xl">
              <option>Frequency</option>
              <option>One-Time</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>
        </div>

        {/* Donate Button */}
        <Link href="/donation/details/">
          <button className="mt-6 w-1/3 bg-[#3D7048] text-white text-lg font-semibold py-4 rounded-lg shadow hover:bg-[#2f5a3a] transition">
            Donate
          </button>
        </Link>
      </div>
    </div>
  );
}

/* Donation Card Component */
function DonationCard({ amount, title, desc, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full rounded-xl border p-4 flex gap-4 items-start cursor-pointer transition
        ${selected ? "bg-gray-300" : "bg-[#F8F5F0] hover:bg-gray-100"}
      `}
    >
      <div className="text-[#3D7048] text-xl font-bold min-w-[60px]">
        ${amount}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}
