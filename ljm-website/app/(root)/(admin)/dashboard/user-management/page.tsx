import React from "react";
import { fetchAdmins, FetchCrew } from "@/actions/crew";
import UserManagementClient from "../../components/UserManagementClient";

export default async function UserManagementPage() {
  const crewData = await FetchCrew();
  const adminData = await fetchAdmins();
  return (
    <UserManagementClient
      Crew={crewData.data || []}
      Admins={adminData.data || []}
    />
  );
}
