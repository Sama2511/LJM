import ContactForm from "@/components/email/ContactForm";
import React from "react";

export default function page() {
  return (
    <>
      <h1 className="mt-10 text-center font-serif text-5xl font-bold text-[#157A4E] sm:text-6xl lg:text-7xl">
        Our Services
      </h1>
      <ContactForm />
    </>
  );
}
