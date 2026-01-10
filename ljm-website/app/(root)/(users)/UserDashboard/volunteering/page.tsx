import { GetMyVolunteering } from "@/actions/my-volunteering";
import UserProfile from "@/app/(root)/(users)/components/UserProfile";
import MyVolunteeringClient from "../../components/MyVolunteeringClient";

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
