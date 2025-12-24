type Props = {
  status: "pending" | "approved" | "rejected" | "cancelled";
};

export default function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`
        inline-flex
        justify-center
        items-center
        min-w-[90px]
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        capitalize
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
}