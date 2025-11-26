"use client";

export default function UserNavUser() {
  const fakeUser = {
    name: "Volunteer",
    email: "volunteer@example.com",
    avatar: "/default-avatar.png",
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100">
      <img
        src={fakeUser.avatar}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{fakeUser.name}</p>
        <p className="text-sm text-gray-500">{fakeUser.email}</p>
      </div>
    </div>
  );
}