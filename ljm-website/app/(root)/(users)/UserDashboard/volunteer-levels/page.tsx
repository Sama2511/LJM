export default function VolunteerLevelPage() {
    return (
<div className="mx-auto mt-20 mb-56 w-[90%] max-w-6xl pb-28">
          <h2 className="text-foreground mb-12 text-center font-chillax text-3xl font-bold lg:text-4xl">
            Volunteer Levels
          </h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Kindling */}
            <div className="rounded-xl border-l-4 border-yellow-500 bg-white p-8 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-yellow-700">
                🌱🟢 Kindling
              </h3>
              <p className="leading-relaxed text-gray-700">
                New volunteers who are beginning their journey in helping the
                community.
              </p>
            </div>

            {/* Kindlers */}
            <div className="rounded-xl border-l-4 border-orange-500 bg-white p-8 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-orange-700">
                🔥🟠 Kindlers
              </h3>
              <p className="leading-relaxed text-gray-700">
                Volunteer organisers helping coordinate activities and support
                events.
              </p>
            </div>

            {/* Flames */}
            <div className="rounded-xl border-l-4 border-red-500 bg-white p-8 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-red-600">
                🔥🔴 Flames
              </h3>
              <p className="leading-relaxed text-gray-700">
                Lead volunteers and ambassadors supporting major projects and
                initiatives.
              </p>
            </div>

            {/* Fire Keepers */}
            <div className="rounded-xl border-l-4 border-purple-600 bg-white p-8 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-purple-700">
                🔥🟣 Fire Keepers
              </h3>
              <p className="leading-relaxed text-gray-700">
                Senior volunteers and long-term supporters offering guidance and
                leadership.
              </p>
            </div>
          </div>
        </div>
    );
     }