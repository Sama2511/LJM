import { Minus } from "lucide-react";
import React from "react";

export default function DashNav() {
  return (
    <div className="m-auto w-[min(600px,80%)] px-5">
      <h1 className="mb-10 text-center text-2xl">Registration</h1>

      <div className="relative before:absolute before:top-3.5 before:left-[50%] before:h-[1px] before:w-[var(--progress-width)] before:translate-x-[-50%] before:translate-y-[-50%] before:bg-black before:content-['']">
        {/* //Progress container */}
        <div className=""></div>
        {/* //progress */}
        <ol className="relative z-[3] flex list-none justify-between gap-10 [counter-reset:step-number]">
          <li className="before:bg-background flex flex-1 flex-col items-center gap-1.5 before:flex before:h-[var(--step-size)] before:w-[var(--step-size)] before:items-center before:justify-center before:rounded-full before:border-1 before:content-[counter(step-number)] before:[counter-increment:step-number]">
            Sign Up
          </li>
          <li className="before:bg-background flex flex-1 flex-col items-center gap-1.5 before:flex before:h-[var(--step-size)] before:w-[var(--step-size)] before:items-center before:justify-center before:rounded-full before:border-1 before:content-[counter(step-number)] before:[counter-increment:step-number]">
            Volunteer Application
          </li>
          <li className="before:bg-background flex flex-1 flex-col items-center gap-1.5 before:flex before:h-[var(--step-size)] before:w-[var(--step-size)] before:items-center before:justify-center before:rounded-full before:border-1 before:content-[counter(step-number)] before:[counter-increment:step-number]">
            Confirmation
          </li>
        </ol>
      </div>
    </div>
  );
}

{
  /* <div className="space-y-15 bg-white font-semibold text-[#157A4E]">
  <div className="flex items-center justify-between space-x-1.5">
    <p>Register In</p>
    <div className="flex size-10 items-center justify-center rounded-full border-1 before:content-['']">
      1
    </div>
  </div>
  <div className="flex items-center justify-between space-x-5">
    <p>Voluntter Application</p>
    <div className="flex flex-col items-center">
      <div className="text-background h-[100px] w-[2px] bg-green-800"></div>
      <div className="flex size-10 items-center justify-center rounded-full border-1">
        2
      </div>
    </div>
  </div>
  <div className="flex items-center justify-between">
    <p>Confirmation</p>
    <div className="flex size-10 items-center justify-center rounded-full border-1">
      3
    </div>
  </div>
</div> */
}
