type Props = {
  status: "pending" | "approved" | "rejected" | "cancelled";
};

export default function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    pending: "bg-accent/20 text-accent-foreground",
    approved: "bg-secondary/30 text-secondary-foreground",
    rejected: "bg-destructive/20 text-destructive",
    cancelled: "bg-muted text-muted-foreground",
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