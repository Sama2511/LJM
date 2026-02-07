"use client";

import { useState, useTransition } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

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
  const [pendingPage, setPendingPage] = useState(1);
  const [acceptedPage, setAcceptedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const ROWS_PER_PAGE = 10;

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

  const pendingTotalPages = Math.ceil(Pending.length / ROWS_PER_PAGE);
  const paginatedPending = Pending.slice(
    (pendingPage - 1) * ROWS_PER_PAGE,
    pendingPage * ROWS_PER_PAGE,
  );

  const acceptedTotalPages = Math.ceil(Accepted.length / ROWS_PER_PAGE);
  const paginatedAccepted = Accepted.slice(
    (acceptedPage - 1) * ROWS_PER_PAGE,
    acceptedPage * ROWS_PER_PAGE,
  );

  const rejectedTotalPages = Math.ceil(Rejected.length / ROWS_PER_PAGE);
  const paginatedRejected = Rejected.slice(
    (rejectedPage - 1) * ROWS_PER_PAGE,
    rejectedPage * ROWS_PER_PAGE,
  );

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    setPage: (page: number) => void,
  ) => {
    if (totalPages <= 1) return null;
    return (
      <Pagination className="py-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          {getPageNumbers(currentPage, totalPages).map((page, i) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
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

  const renderApplicationCard = (application: Application) => (
    <div
      key={application.id}
      className="bg-card flex flex-col gap-3 rounded-lg border p-4 shadow-sm"
    >
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
        <div className="flex-1">
          <p className="font-medium">
            {application.users.firstname} {application.users.lastname}
          </p>
          <p className="text-muted-foreground text-sm">
            {application.users.email}
          </p>
        </div>
        <Badge
          variant={
            application.status === "Pending"
              ? "outline"
              : application.status === "Accepted"
                ? "default"
                : "destructive"
          }
        >
          {application.status}
        </Badge>
      </div>

      <p className="text-muted-foreground text-sm">
        Submitted: {formatDate(application.created_at)}
      </p>

      <div className="flex flex-wrap gap-2">
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
              {processingId === application.id ? "..." : "Accept"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={() => handleReject(application.id)}
              disabled={processingId !== null}
            >
              <XCircle className="h-4 w-4" />
              {processingId === application.id ? "..." : "Reject"}
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full pt-10 pr-4 md:pr-12">
      <AdminProfile pageName="Crew Applications" />

      <Tabs defaultValue="pending" className="w-full">
        <div className="flex flex-col gap-5">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="mb-6 flex items-center gap-2">
            <div className="bg-muted relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search for users"
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-9"
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
          {/* Mobile card layout */}
          <div className="flex flex-col gap-4 md:hidden">
            {Pending.length > 0 ? (
              paginatedPending.map((application) =>
                renderApplicationCard(application),
              )
            ) : (
              <p className="text-muted-foreground py-8 text-center">
                No pending applications
              </p>
            )}
          </div>

          {/* Desktop table layout */}
          <div className="bg-card hidden rounded-lg border shadow-sm md:block">
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
                  paginatedPending.map((application) =>
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
          {renderPagination(pendingPage, pendingTotalPages, setPendingPage)}
        </TabsContent>

        <TabsContent value="accepted">
          {/* Mobile card layout */}
          <div className="flex flex-col gap-4 md:hidden">
            {Accepted.length > 0 ? (
              paginatedAccepted.map((application) =>
                renderApplicationCard(application),
              )
            ) : (
              <p className="text-muted-foreground py-8 text-center">
                No accepted applications
              </p>
            )}
          </div>

          {/* Desktop table layout */}
          <div className="bg-card hidden rounded-lg border shadow-sm md:block">
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
                  paginatedAccepted.map((application) =>
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
          {renderPagination(acceptedPage, acceptedTotalPages, setAcceptedPage)}
        </TabsContent>

        <TabsContent value="rejected">
          {/* Mobile card layout */}
          <div className="flex flex-col gap-4 md:hidden">
            {Rejected.length > 0 ? (
              paginatedRejected.map((application) =>
                renderApplicationCard(application),
              )
            ) : (
              <p className="text-muted-foreground py-8 text-center">
                No rejected applications
              </p>
            )}
          </div>

          {/* Desktop table layout */}
          <div className="bg-card hidden rounded-lg border shadow-sm md:block">
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
                  paginatedRejected.map((application) =>
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
          {renderPagination(rejectedPage, rejectedTotalPages, setRejectedPage)}
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
