import UserProfile from "@/app/(root)/(users)/components/UserProfile";

export default function UserDashboardPage() {
  return (
    <div className="w-full p-6">
      <UserProfile pageName="Dashboard" />
      <p className="text-muted-foreground mt-2">
        Here you can track your status, profile and volunteer level.
      </p>
    </div>
  );
}
