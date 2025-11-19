import ContactForm from "@/components/ContactForm";
import React from "react";
import { Phone, Mail, Map, Clock } from "lucide-react";
import {
  FaFacebookSquare,
  FaLinkedin,
  FaInstagramSquare,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { Card } from "@/components/ui/card";

export default function page() {
  return (
    <div className="m-auto max-w-[90%] py-10">
      <h1 className="text-foreground mt-10 text-center font-serif text-5xl font-bold sm:text-6xl lg:text-7xl">
        Get in touch
      </h1>

      <section className="m-auto max-w-[900px] gap-20 md:flex md:gap-5 lg:gap-30">
        <ContactForm />
        <Card className="m-auto my-10 mt-30 h-fit w-fit border-1 p-10">
          <h2 className="text-xl font-semibold text-[#157A4E]">Chat with us</h2>
          <ul className="mb-10 space-y-3">
            <li className="flex gap-3 ">
              <Phone />
              +91 0000 0000
            </li>
            <li className="flex gap-3">
              <Mail />
              info@LJMMemorialhospice.com
            </li>

            <li className="flex gap-3">
              <Map />
              Yanchep, WA
            </li>
            <li className="flex gap-3">
              <Clock />
              Mon – Fri: 9:00 am – 5:00 pm
            </li>
          </ul>
          <h2 className="text-xl font-semibold text-[#157A4E]">
            Connect with LJM Hospice
          </h2>
          <div className="flex justify-center gap-5">
            <FaLinkedin size={30} color="0077b5" />
            <FaFacebookSquare size={30} color="1877f2" />
            <FaInstagram size={30} />
            <FaYoutube size={30} color="ff0000" />
          </div>
        </Card>
      </section>
    </div>
  );
}
