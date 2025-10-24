import React from "react";

export default function page() {
  return (
    <>
      <div className="flex w-full flex-col text-white">
        <h1 className="my-10 text-center font-serif text-5xl font-bold text-[#157A4E] sm:text-6xl lg:text-7xl">
          Services
        </h1>
        {/* --- Section 1 --- */}
        <div className="group relative min-h-[150px] overflow-hidden rounded-none bg-[url(/bgPic1.png)] bg-cover bg-center text-center transition-all duration-700 ease-in-out lg:hover:min-h-[400px]">
          <div className="absolute inset-0 bg-black/30 transition-colors duration-700 ease-in-out lg:group-hover:bg-black/50"></div>

          <h3 className="relative z-10 mt-10 text-center text-3xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] transition-all duration-700 ease-in-out lg:text-5xl">
            Advanced Care Planning
          </h3>

          <p className="relative z-10 mx-auto flex items-center justify-center p-10 px-7 text-center leading-loose text-white drop-shadow-[3px_3px_4.4px_#000000] transition-all duration-700 ease-in-out lg:absolute lg:inset-0 lg:mt-5 lg:max-w-[75%] lg:translate-y-full lg:pt-20 lg:text-lg lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            We believe that every individual deserves to have their end-of-life
            wishes respected and honoured. Our Advanced Care Planning services
            are designed to help patients and their families make informed
            decisions about their care preferences, including medical
            treatments, pain management, and quality of life goals. Our caring
            and skilled professionals work closely with patients and families to
            provide guidance, support, and resources for creating personalised
            care plans that reflect their unique values, beliefs, and desires.
            We understand that Advanced Care Planning can be a sensitive and
            emotional process, and we are here to listen, validate, and assist
            with empathy and understanding. Advanced Care Planning can be done
            at any time by anyone.
          </p>
        </div>

        <div className="group relative min-h-[150px] overflow-hidden rounded-none bg-[url(/bgPic2.png)] bg-cover bg-center text-center transition-all duration-700 ease-in-out lg:hover:min-h-[350px]">
          <div className="absolute inset-0 bg-black/30 transition-colors duration-700 ease-in-out lg:group-hover:bg-black/50"></div>

          <h3 className="relative z-10 mt-10 text-center text-3xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] transition-all duration-700 ease-in-out lg:text-5xl">
            Conpassionate Communities
          </h3>

          <p className="relative z-10 mx-auto flex items-center justify-center p-10 px-7 text-center leading-loose text-white drop-shadow-[3px_3px_4.4px_#000000] transition-all duration-700 ease-in-out lg:absolute lg:inset-0 lg:mt-5 lg:max-w-[75%] lg:translate-y-full lg:pt-20 lg:text-lg lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            Compassionate Communities aim to empower and engage individuals,
            groups, and organizations to work together to support those who are
            facing advanced illness, dying, or grief. Through shared compassion,
            community education, and meaningful connection, we help normalize
            conversations around death and dying and create spaces of empathy
            and care. Our programs encourage collaboration between healthcare
            providers, families, and community members to foster inclusiveness,
            resilience, and understanding for everyone involved.
          </p>
        </div>

        <div className="group relative min-h-[150px] overflow-hidden rounded-none bg-[url(/bgPic3.png)] bg-cover bg-center text-center transition-all duration-700 ease-in-out lg:hover:min-h-[300px]">
          <div className="absolute inset-0 bg-black/30 transition-colors duration-700 ease-in-out lg:group-hover:bg-black/50"></div>

          <h3 className="relative z-10 mt-10 text-center text-3xl font-bold text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] transition-all duration-700 ease-in-out lg:text-5xl">
            Death cafes
          </h3>

          <p className="relative z-10 mx-auto flex items-center justify-center p-10 px-7 text-center leading-loose text-white drop-shadow-[3px_3px_4.4px_#000000] transition-all duration-700 ease-in-out lg:absolute lg:inset-0 lg:mt-5 lg:max-w-[75%] lg:translate-y-full lg:pt-20 lg:text-lg lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            Death Cafes provide a safe and informal space for open discussions
            about death, dying, and the meaning of life. By talking freely and
            without judgment, participants can reduce fear and anxiety
            surrounding death, while fostering understanding and connection. Our
            sessions are inclusive, respectful, and often deeply meaningful —
            offering comfort, insight, and a sense of shared humanity in facing
            one of life’s most natural experiences.
          </p>
        </div>
      </div>
    </>
  );
}
