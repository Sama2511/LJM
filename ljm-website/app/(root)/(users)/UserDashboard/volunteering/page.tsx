import { GetMyVolunteering } from "@/actions/my-volunteering";
import MyVolunteeringClient from "@/app/(root)/(users)/UserDashboard/MyVolunteeringClient";


export default async function MyVolunteeringPage() {
  const { data } = await GetMyVolunteering();

  return <MyVolunteeringClient data={data || []} />;
}