import UserProfile from "../components/UserProfile";
import ArticleCard from "@/components/ArticleCard";
import { createClient, getUser } from "@/app/utils/server";

export default async function UserDashboardPage() {
  const supabase = await createClient();
  const user = await getUser();

  // -----------------------------
  // User profile data
  // -----------------------------
  let firstName: string | null = null;
  let formCompleted = false;

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("firstname, formcompleted")
      .eq("id", user.id)
      .single();

    firstName = profile?.firstname ?? null;
    formCompleted = profile?.formcompleted ?? false;
  }

  // -----------------------------
  // Participation data
  // -----------------------------
  const { data: requests } = await supabase
    .from("volunteer_requests")
    .select("event_id, role_id")
    .eq("user_id", user?.id)
    .eq("status", "approved");

  const eventIds = requests?.map((r) => r.event_id) ?? [];

  const { data: events } = eventIds.length
    ? await supabase
        .from("events")
        .select("id, date")
        .in("id", eventIds)
    : { data: [] };

  // -----------------------------
  // Stats calculation
  // -----------------------------
  const now = new Date();

  const joinedCount = requests?.length ?? 0;
  const pastCount =
    events?.filter((e) => new Date(e.date) < now).length ?? 0;
  const upcomingCount =
    events?.filter((e) => new Date(e.date) >= now).length ?? 0;
  const roleCount = new Set(
    requests?.map((r) => r.role_id)
  ).size;

  // -----------------------------
  // Achievements logic
  // -----------------------------
  const achievements = [
    {
      title: "First Event Joined",
      unlocked: joinedCount >= 1,
      hint: "Unlocked after joining your first event",
    },
    {
      title: "Getting Involved",
      unlocked: joinedCount >= 3,
      hint: "Unlocked after joining 3 events",
    },
    {
      title: "Active Volunteer",
      unlocked: joinedCount >= 5,
      hint: "Unlocked after joining 5 events",
    },
    {
      title: "Role Explorer",
      unlocked: roleCount >= 2,
      hint: "Unlocked after volunteering in different roles",
    },
    {
      title: "Profile Ready",
      unlocked: formCompleted,
      hint: "Unlocked after completing your volunteer profile",
    },
  ];

  // -----------------------------
  // Community Stories (Articles)
  // -----------------------------
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, content, image_url, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="w-full p-6">
      <UserProfile pageName="Dashboard" />

      {/* Welcome */}
      <p className="text-muted-foreground mt-2">
        Welcome back
        {firstName && (
          <>
            , <span className="font-semibold">{firstName}</span>
          </>
        )}
        ! <br />
        Your involvement helps support our community in meaningful ways.
      </p>

      {/* Participation Overview */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Participation Overview
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Events joined
            </p>
            <p className="text-2xl font-semibold">{joinedCount}</p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Upcoming events
            </p>
            <p className="text-2xl font-semibold">{upcomingCount}</p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Past events
            </p>
            <p className="text-2xl font-semibold">{pastCount}</p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
              Roles participated
            </p>
            <p className="text-2xl font-semibold">{roleCount}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Statistics are based on events you have chosen to join.
        </p>
      </section>

      {/* Achievements */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4">
          Achievements
        </h2>

        <ul className="space-y-3">
          {achievements.map((a) => (
            <li key={a.title} className="flex items-center gap-2">
              <span className="text-lg">
                {a.unlocked ? "✔" : "⬜"}
              </span>

              <span
                className={
                  a.unlocked ? "" : "text-muted-foreground"
                }
              >
                {a.title}
              </span>

              {/* Tooltip */}
              <span className="relative group ml-1">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-xs font-medium text-muted-foreground cursor-help">
                  ?
                </span>

                <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border bg-background px-2 py-1 text-xs text-foreground shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
                  {a.hint}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Community Stories */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-1">
          Community Stories
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Moments and experiences shared by our volunteers and community members.
        </p>

        {articles && articles.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  content={article.content}
                  image_url={
  article.image_url &&
  (article.image_url.startsWith("http") ||
    article.image_url.startsWith("/"))
    ? article.image_url
    : "/dummy-image-square8.png"
}
                  created_at={article.created_at}
                />
              ))}
            </div>

            <div className="mt-6">
              <a
                href="/articles"
                className="text-sm font-medium underline underline-offset-4"
              >
                View all stories
              </a>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No stories available yet.
          </p>
        )}
      </section>
    </div>
  );
}