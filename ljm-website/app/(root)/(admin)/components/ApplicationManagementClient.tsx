"use client";

import React, { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, FileText, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import ViewVolunteerFormDialog from "./ViewVolunteerFormDialog";
import AdminProfile from "./AdminProfile";
import { ApproveApplication, RejectApplication } from "@/actions/volunteer";
import { toast } from "sonner";

const getInitials = (firstname: string, lastname: string) => {
  return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type Application = {
  id: string;
  created_at: string;
  phone: string | null;
  emergency_contact: string | null;
  activities: string;
  interests: string | null;
  skills: string | null;
  story: string | null;
  availability: string;
  certificate: string;
  inspiration: string;
  status: string;
  user_id: string;
  users: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar_url?: string;
    created_at: string;
  };
};

type ApplicationManagementClientProps = {
  Pending: Application[];
  Accepted: Application[];
  Rejected: Application[];
};

export default function ApplicationManagementClient({
  Pending,
  Accepted,
  Rejected,
}: ApplicationManagementClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.push(`?${params.toString()}`);
    });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    startTransition(() => {
      router.push("/dashboard/CrewApplication");
    });
  };

  const handleViewForm = (application: Application) => {
    setSelectedFormData(application);
    setDialogOpen(true);
  };

  const handleApprove = async (applicationId: string) => {
    setProcessingId(applicationId);
    const result = await ApproveApplication(applicationId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Application approved successfully");
      router.refresh();
    }
    setProcessingId(null);
  };

  const handleReject = async (applicationId: string) => {
    setProcessingId(applicationId);
    const result = await RejectApplication(applicationId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Application rejected");
      router.refresh();
    }
    setProcessingId(null);
  };

  const renderApplicationRow = (application: Application) => (
    <TableRow key={application.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={application.users.avatar_url} />
            <AvatarFallback className="bg-accent-foreground text-white">
              {getInitials(
                application.users.firstname,
                application.users.lastname,
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {application.users.firstname} {application.users.lastname}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <p className="text-muted-foreground text-sm">
          {application.users.email}
        </p>
      </TableCell>

      <TableCell>
        <p className="text-sm">{formatDate(application.created_at)}</p>
      </TableCell>

      <TableCell className="font-bold">{application.status}</TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => handleViewForm(application)}
          >
            <FileText className="h-4 w-4" />
            View
          </Button>
          {application.status === "Pending" && (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={() => handleApprove(application.id)}
                disabled={processingId !== null}
              >
                <CheckCircle className="h-4 w-4" />
                {processingId === application.id ? "Processing..." : "Accept"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => handleReject(application.id)}
                disabled={processingId !== null}
              >
                <XCircle className="h-4 w-4" />
                {processingId === application.id ? "Processing..." : "Reject"}
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="w-full p-6">
      <AdminProfile pageName="Crew Applications" />

      <Tabs defaultValue="pending" className="w-full">
        <div className="flex gap-5">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="mb-6 flex items-center gap-2">
            <div className="bg-muted relative max-w-md flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pr-9 pl-9"
              />
              {searchInput && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isPending && (
              <span className="text-muted-foreground text-sm">
                Searching...
              </span>
            )}
          </div>
        </div>

        <TabsContent value="pending">
          <div className="bg-card rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Pending.length > 0 ? (
                  Pending.map((application) =>
                    renderApplicationRow(application),
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground py-8 text-center"
                    >
                      No pending applications
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="accepted">
          <div className="bg-card rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Accepted.length > 0 ? (
                  Accepted.map((application) =>
                    renderApplicationRow(application),
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground py-8 text-center"
                    >
                      No accepted applications
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="bg-card rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Rejected.length > 0 ? (
                  Rejected.map((application) =>
                    renderApplicationRow(application),
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground py-8 text-center"
                    >
                      No rejected applications
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <ViewVolunteerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        formData={selectedFormData}
      />
    </div>
  );
}
