import ContactForm from "@/components/ContactForm";
import React from "react";
import { Phone, Mail, Map, Clock } from "lucide-react";
import {
  FaFacebookSquare,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { createClient } from "@/app/utils/server";

function ensureHttps(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
}

async function getSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*");

  const settings: Record<string, string> = {};
  if (data) {
    data.forEach((setting) => {
      let value = setting.setting_value || "";
      if (setting.setting_key.startsWith("social_") && value) {
        value = ensureHttps(value);
      }
      settings[setting.setting_key] = value;
    });
  }
  return settings;
}

export default async function page() {
  const settings = await getSettings();

  return (
    <div className="font-chillax m-auto h-full max-w-[90%] py-10">
      <h1 className="text-foreground mt-5 text-center text-5xl font-medium sm:text-6xl lg:text-7xl">
        Get in touch
      </h1>
      <section className="m-auto max-w-[900px] gap-20 md:flex md:gap-5 lg:gap-30">
        <ContactForm />
        <Card className="bg-muted m-auto my-10 mt-20 h-fit border p-10 sm:max-w-md">
          <h2 className="text-primary text-xl font-semibold">Chat with us</h2>
          <ul className="text-foreground mb-10 space-y-3">
            <li className="flex gap-3">
              <Phone />
              {settings.contact_phone || "+91 0000 0000"}
            </li>
            <li className="flex gap-3">
              <Mail />
              {settings.contact_email || "info@LJMMemorialhospice.com"}
            </li>

            <li className="flex gap-3">
              <Map />
              {settings.contact_location || "Yanchep, WA"}
            </li>
            <li className="flex gap-3">
              <Clock />
              {settings.contact_hours || "Mon – Fri: 9:00 am – 5:00 pm"}
            </li>
          </ul>
          <h2 className="text-primary text-xl font-semibold">
            Connect with Kindlewood
          </h2>
          <div className="flex justify-center gap-5">
            {settings.social_linkedin && (
              <a
                href={settings.social_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <FaLinkedin size={30} color="#0077b5" />
              </a>
            )}
            {settings.social_facebook && (
              <a
                href={settings.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <FaFacebookSquare size={30} color="1877f2" />
              </a>
            )}
            {settings.social_instagram && (
              <a
                href={settings.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <FaInstagram size={30} color="#c90076" />
              </a>
            )}
            {settings.social_youtube && (
              <a
                href={settings.social_youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <FaYoutube size={30} color="#ff0000" />
              </a>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
