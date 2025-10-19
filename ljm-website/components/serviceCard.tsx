import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function ServiceCard({ icon: Icon, title, description }: ServiceCardProps) {
  return (
    <Card className="flex h-[400px] w-[250px] justify-center overflow-hidden border-none bg-gradient-to-b from-[#5E936C] from-30% to-[#1D2D21] pb-10 text-white">
      <CardHeader className="flex flex-col items-center text-center">
        <Icon className="h-16 w-16 text-black" />
        <h2 className="mt-4 px-5 text-2xl font-bold">{title}</h2>
      </CardHeader>
      <CardContent className="flex justify-center">
        <p className="w-[95%] text-center leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center pt-1">
        <Button asChild variant="outline">
          <Link href="/service" className="font-semibold text-[#3E5F44]">
            More Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;

// import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";

// type Props = {
//   title: string;
//   description: string;
//   date: string;
//   time: string;
//   location: string;
//   imageUrl: string;
//   onVolunteer: () => void;
//   onDetails: () => void;
// };

// export default function ServiceCard({
//   title,
//   description,
//   date,
//   time,
//   location,
//   imageUrl,
//   onVolunteer,
//   onDetails,
// }: Props) {
//   return (
//     <div className="mx-auto max-w-2xl rounded-3xl border-4 border-blue-500 bg-gray-100 p-8">
//       <div className="mb-6 rounded-2xl border-2 border-green-600 bg-white p-6">
//         <div className="mb-4 flex items-start justify-between">
//           <div className="flex items-center gap-2 text-gray-700">
//             <Calendar className="h-5 w-5 text-green-700" />
//             <span className="font-medium">{date}</span>
//           </div>
//         </div>

//         <div className="mb-4 flex items-center gap-2 text-gray-700">
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700">
//             <Clock className="h-5 w-5 text-white" />
//           </div>
//           <span className="font-medium">{time}</span>
//         </div>

//         <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
//           {imageUrl ? (
//             <img
//               src={imageUrl}
//               alt={title}
//               className="h-full w-full object-cover"
//             />
//           ) : (
//             <div className="flex flex-col items-center justify-center text-gray-400">
//               <div className="relative mb-2 h-24 w-24 rounded-lg border-8 border-gray-300">
//                 <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-gray-300" />
//                 <div
//                   className="absolute bottom-0 left-0 h-12 w-full bg-gray-300"
//                   style={{
//                     clipPath:
//                       "polygon(0 50%, 50% 0, 100% 50%, 100% 100%, 0 100%)",
//                   }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="mb-6">
//         <div className="mb-4 flex items-start justify-between">
//           <h2 className="text-4xl font-bold text-green-800">{title}</h2>
//           <div className="flex items-center gap-2 text-gray-700">
//             <MapPin className="h-6 w-6 text-green-700" />
//             <span className="font-medium">{location}</span>
//           </div>
//         </div>

//         <p className="text-lg leading-relaxed text-gray-800">{description}</p>
//       </div>

//       <div className="flex gap-4">
//         <button
//           onClick={onVolunteer}
//           className="rounded-lg bg-green-700 px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-green-800"
//         >
//           Volunteer
//         </button>
//         <button
//           onClick={onDetails}
//           className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 font-semibold text-gray-800 shadow-lg transition-colors hover:bg-gray-50"
//         >
//           <ExternalLink className="h-5 w-5" />
//           Details
//         </button>
//       </div>
//     </div>
//   );
// }
