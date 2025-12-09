import React from "react";
import {
  FetchPendingApplications,
  FetchAcceptedApplications,
  FetchRejectedApplications,
} from "@/actions/crew";
import ApplicationManagementClient from "../../components/ApplicationManagementClient";

export default async function CrewApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchQuery = await searchParams;
  const pendingData = await FetchPendingApplications(searchQuery.q);
  const acceptedData = await FetchAcceptedApplications(searchQuery.q);
  const rejectedData = await FetchRejectedApplications(searchQuery.q);

  return (
    <ApplicationManagementClient
      Pending={pendingData.data || []}
      Accepted={acceptedData.data || []}
      Rejected={rejectedData.data || []}
    />
  );
}
