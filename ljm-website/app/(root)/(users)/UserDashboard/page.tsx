import UserProfile from "../components/UserProfile";
import { createClient, getUser } from "@/app/utils/server";
import { Card, CardContent } from "@/components/ui/card";

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
    ? await supabase.from("events").select("id, date").in("id", eventIds)
    : { data: [] };

  // -----------------------------
  // Stats calculation
  // -----------------------------
  const now = new Date();

  const joinedCount = requests?.length ?? 0;
  const pastCount = events?.filter((e) => new Date(e.date) < now).length ?? 0;
  const upcomingCount =
    events?.filter((e) => new Date(e.date) >= now).length ?? 0;
  const roleCount = new Set(requests?.map((r) => r.role_id)).size;

  // -----------------------------
  // Achievements logic
  // -----------------------------
  const achievements = [
    {
      title: "First Event",
      description: "Join your first event",
      unlocked: joinedCount >= 1,
      current: joinedCount,
      target: 1,
    },
    {
      title: "Getting Involved",
      description: "Join 3 events",
      unlocked: joinedCount >= 3,
      current: Math.min(joinedCount, 3),
      target: 3,
    },
    {
      title: "Active Volunteer",
      description: "Join 5 events",
      unlocked: joinedCount >= 5,
      current: Math.min(joinedCount, 5),
      target: 5,
    },
    {
      title: "Role Explorer",
      description: "Try 2 different roles",
      unlocked: roleCount >= 2,
      current: Math.min(roleCount, 2),
      target: 2,
    },
    {
      title: "Profile Complete",
      description: "Complete your profile",
      unlocked: formCompleted,
      current: formCompleted ? 1 : 0,
      target: 1,
    },
  ];

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
        <h2 className="mb-4 text-lg font-semibold">Participation Overview</h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          <Card className="bg-muted border-accent-foreground">
            <CardContent className="p-3 md:p-4">
              <p className="text-xl font-bold md:text-2xl">{joinedCount}</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                Events Joined
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-accent-foreground">
            <CardContent className="p-3 md:p-4">
              <p className="text-xl font-bold md:text-2xl">{upcomingCount}</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                Upcoming Events
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-accent-foreground">
            <CardContent className="p-3 md:p-4">
              <p className="text-xl font-bold md:text-2xl">{pastCount}</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                Past Events
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted border-accent-foreground">
            <CardContent className="p-3 md:p-4">
              <p className="text-xl font-bold md:text-2xl">{roleCount}</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                Roles Participated
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground mt-2 text-xs">
          Statistics are based on events you have chosen to join.
        </p>
      </section>

      {/* Achievements */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Achievements</h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {achievements.map((achievement) => {
            const progress = (achievement.current / achievement.target) * 100;

            return (
              <Card
                key={achievement.title}
                className={`border-accent-foreground transition-all ${
                  achievement.unlocked
                    ? "bg-primary/10 border-primary"
                    : "bg-muted opacity-75"
                }`}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <p
                      className={`text-sm font-semibold ${
                        achievement.unlocked
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {achievement.title}
                    </p>
                    {achievement.unlocked && (
                      <span className="text-primary text-xs font-medium">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3 text-xs">
                    {achievement.description}
                  </p>

                  {/* Progress bar */}
                  <div className="bg-muted-foreground/20 h-1.5 overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-all ${
                        achievement.unlocked
                          ? "bg-primary"
                          : "bg-muted-foreground/50"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-muted-foreground mt-1 text-right text-xs">
                    {achievement.current}/{achievement.target}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
