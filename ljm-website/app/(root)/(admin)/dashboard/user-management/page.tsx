import React from "react";
import { fetchAdmins, FetchCrew } from "@/actions/crew";
import UserManagementClient from "../../components/UserManagementClient";

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchQuery = (await searchParams) || "";
  const crewData = await FetchCrew(searchQuery.q);
  const adminData = await fetchAdmins(searchQuery.q);
  return (
    <UserManagementClient
      Crew={crewData.data || []}
      Admins={adminData.data || []}
    />
  );
}
