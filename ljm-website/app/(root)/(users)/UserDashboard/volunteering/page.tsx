import { GetMyVolunteering } from "@/actions/my-volunteering";
import MyVolunteeringClient from "@/app/(root)/(users)/UserDashboard/MyVolunteeringClient";
import UserProfile from "@/app/(root)/(users)/components/UserProfile";

export default async function MyVolunteeringPage() {
  const { data } = await GetMyVolunteering();

  return (
    <div className="w-full p-6">
      <UserProfile pageName="My Volunteering" />

      <div className="mt-8">
        <MyVolunteeringClient data={data ?? []} />
      </div>
    </div>
  );
}