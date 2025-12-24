import { GetMyVolunteering } from "@/actions/my-volunteering";
import MyVolunteeringClient from "@/app/(root)/(users)/UserDashboard/MyVolunteeringClient";
import UserProfile from "../../components/UserProfile";

export default async function MyVolunteeringPage() {
  const { data } = await GetMyVolunteering();

  return (
    <div className="p-6">
      <UserProfile pageName="My Volunteering"/>

      <MyVolunteeringClient data={data ?? []} />
    </div>
  );
}