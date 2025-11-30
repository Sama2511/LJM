import { Calendar, Clock, MapPin, Pencil, Trash2 } from "lucide-react";

type Props = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  maxCapacity: number;
  image?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function EventMngtCard({
  title,
  description,
  date,
  time,
  location,
  capacity,
  maxCapacity,
  image,
  onEdit,
  onDelete,
}: Props) {
  const percentage = (capacity / maxCapacity) * 100;

  return (
    <div className="group max-w-[350px] overflow-hidden rounded-2xl border border-[#3E5F44]/40 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#3E5F44] hover:shadow-xl">
      {/* IMAGE HEADER */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image || "/dummy-image-square8.png"} //
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* TEXT OVER IMAGE */}
        <div className="absolute bottom-3 left-4">
          <h2 className="text-2xl font-semibold text-white drop-shadow">
            {title}
          </h2>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="p-6">
        <p className="mb-6 line-clamp-3 text-base text-[#3E5F44]/80">
          {description}
        </p>

        {/* DETAILS */}
        <div className="mb-6 space-y-3 text-base text-[#3E5F44]">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{location}</span>
          </div>
        </div>

        {/* CAPACITY BAR */}
        <div>
          <p className="mb-1 text-sm text-[#3E5F44]">
            Capacity: {capacity}/{maxCapacity}
          </p>

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#3E5F44]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex items-center justify-between font-semibold">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-xl border-2 border-[#3E5F44] px-5 py-2.5 text-[#3E5F44] transition-all duration-200 hover:bg-[#3E5F44] hover:text-white"
          >
            <Pencil className="h-5 w-5" />
            Edit
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-xl border-2 border-red-600 px-5 py-2.5 text-red-600 transition-all duration-200 hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
