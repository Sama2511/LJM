"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function CrewApplication() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      fullName: "Maria Isabel Dacuma",
      email: "12203834@students.koi.edu.au",
      phone: "0412345678",
      status: "accepted",
    },
    {
      id: 2,
      fullName: "Diana Zubrytska",
      email: "12301789@students.koi.edu.au",
      phone: "0499988877",
      status: "pending",
    },
    {
      id: 3,
      fullName: "Oussama Hassoune",
      email: "20020990@students.koi.edu.au",
      phone: "0400111222",
      status: "rejected",
    },
    {
      id: 4,
      fullName: "Carlos Eli Esma",
      email: "12301679@students.koi.edu.au",
      phone: "0422334455",
      status: "pending",
    },
  ]);

  const updateStatus = (id: number, newStatus: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
    );
  };

  const pendingApps = applications.filter((app) => app.status === "pending");
  const acceptedApps = applications.filter((app) => app.status === "accepted");
  const rejectedApps = applications.filter((app) => app.status === "rejected");

  const sectionHeaderStyle = "text-2xl font-bold text-green-600 mb-4";

  const renderTableRows = (apps: typeof applications, showActions = true) =>
    apps.map((app) => (
      <tr key={app.id} className="border-b hover:bg-gray-50">
        <td className="p-3">{app.fullName}</td>
        <td className="p-3">{app.email}</td>
        <td className="p-3">{app.phone}</td>
        <td className="p-3">
          {app.status === "pending" && (
            <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm text-yellow-800">
              Pending
            </span>
          )}
          {app.status === "accepted" && <Badge>Accepted</Badge>}
          {app.status === "rejected" && (
            <span className="rounded-full bg-red-200 px-3 py-1 text-sm text-red-800">
              Rejected
            </span>
          )}
        </td>
        {showActions && (
          <td className="space-x-2 p-3">
            <Button onClick={() => updateStatus(app.id, "accepted")}>
              Accept
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => updateStatus(app.id, "rejected")}
            >
              Reject
            </Button>
            <Button variant={"outline"}>View</Button>
          </td>
        )}
      </tr>
    ));

  const renderSection = (
    title: string,
    apps: typeof applications,
    showActions: boolean,
    bgColor: string,
  ) => (
    <div className={`rounded-xl p-6 shadow-md ${bgColor} space-y-4`}>
      <h2 className={sectionHeaderStyle}>{title}</h2>
      <table className="w-full border-collapse overflow-hidden rounded-lg">
        <thead>
          <tr className="bg-muted border-b text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Status</th>
            {showActions && <th className="p-3">Actions</th>}
          </tr>
        </thead>
        <tbody>{renderTableRows(apps, showActions)}</tbody>
      </table>
    </div>
  );

  return (
    <div className="container w-full space-y-8 pt-10">
      <div className="flex justify-between pb-10">
        <h1 className="font-chillax text-3xl font-semibold">
          Crew Applications
        </h1>
      </div>

      {/* Sections */}
      {pendingApps.length > 0 &&
        renderSection("Pending", pendingApps, true, "bg-muted-50")}
      {acceptedApps.length > 0 &&
        renderSection("Accepted", acceptedApps, false, "bg-muted-100")}
      {rejectedApps.length > 0 &&
        renderSection("Rejected", rejectedApps, false, "bg-muted-50")}
    </div>
  );
}
