import "@/app/globals.css";
import UserSidebar from "../components/UserSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <UserSidebar />

      {/* Page content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}