"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";  

export default function DonationDetailsPage() {
  const [isCompany, setIsCompany] = useState(false);
  const [outsideAus, setOutsideAus] = useState(false);
  const [notify, setNotify] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [sendCard, setSendCard] = useState(false);
  
  const params = useSearchParams();

  const amount = params.get("amount");
  const frequency = params.get("frequency");

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex justify-center py-10">
      <div className="w-full max-w-[700px] px-4">

        <h1 className="text-center text-3xl font-bold font-chillax text-[#3D7048] mb-10">
          Make a difference Today
        </h1>

        <div className="mb-6 flex items-center justify-between">
          <Link href="/donation" className="flex items-center gap-1 text-sm text-black">
            <span className="text-xl">←</span> back
          </Link>

          <div className="rounded-lg border border-black bg-[#E3DED6] px-4 py-2 text-center text-sm font-medium leading-tight">
          $50
          <br />
          per month
          </div>
        </div>

        <form className="flex flex-col gap-6">
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isCompany}
              onChange={(e) => setIsCompany(e.target.checked)}
              className="accent-[#3D7048]"
            />
            I am donating on behalf of a company
          </label>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="border-b border-[#3D7048] bg-transparent py-2 outline-none"
            />
            <input
              type="text"
              placeholder="Last Name*"
              className="border-b border-black bg-transparent py-2 outline-none"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="border-b border-black bg-transparent py-2 outline-none"
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="border-b border-black bg-transparent py-2 outline-none"
          />

          <input
            type="text"
            placeholder="Address"
            className="border-b border-black bg-transparent py-2 outline-none"
          />

          <input
            type="text"
            placeholder="Suburb"
            className="border-b border-black bg-transparent py-2 outline-none"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={outsideAus}
              onChange={(e) => setOutsideAus(e.target.checked)}
              className="accent-[#3D7048]"
            />
            My Address is outside Australia
          </label>

          <textarea
            placeholder="Add a message (optional)"
            className="border border-black p-3 rounded-md min-h-[120px] bg-transparent"
          ></textarea>

          <div className="flex flex-col gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="accent-[#3D7048]"
              />
              Notify someone of this donation
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="accent-[#3D7048]"
              />
              I want to keep my donation anonymous
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sendCard}
                onChange={(e) => setSendCard(e.target.checked)}
                className="accent-[#3D7048]"
              />
              Send a card with this donation (on next step)
            </label>
          </div>

          <Link href="/donation/payment">
            <button type="submit" className="w-full bg-[#3D7048] text-white py-4 mt-4 rounded-md text-lg font-semibold hover:bg-[#345f3f] transition">
              Continue with donation
            </button>
          </Link>
        </form>

      </div>
    </div>
  );
}
