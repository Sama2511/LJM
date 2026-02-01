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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  FileText,
  Shield,
  Ban,
  Trash2,
  ShieldOff,
  Search,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UpdateUserRole,
  MakeUserAdmin,
  BanUser,
  DeleteUser,
  RemoveAdminPrivileges,
  FetchVolunteerForm,
} from "@/actions/crew";
import { toast } from "sonner";
import ViewVolunteerFormDialog from "./ViewVolunteerFormDialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import AdminProfile from "./AdminProfile";

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

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
  formcompleted: boolean;
  role: string;
  avatar_url?: string;
};
type admin = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
  role: string;
  avatar_url?: string;
};

type UserManagementClientProps = {
  Crew: User[];
  Admins: admin[];
};

export default function UserManagementClient({
  Crew,
  Admins,
}: UserManagementClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState<any>(null);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [crewPage, setCrewPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
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
      router.push("/dashboard/user-management");
    });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const result = await UpdateUserRole(userId, newRole);
    if (!result.success) {
      toast.error(result.error || "Failed to update role");
    } else {
      toast.success("Role updated successfully");
      router.refresh();
    }
  };

  const handleViewForm = async (userId: string) => {
    const result = await FetchVolunteerForm(userId);
    if (result.error) {
      toast.error("Failed to fetch volunteer form");
    } else {
      setSelectedFormData(result.data);
      setDialogOpen(true);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    const result = await MakeUserAdmin(userId);
    if (!result.success) {
      toast.error(result.error || "Failed to make user admin");
    } else {
      toast.success("User promoted to admin");
      router.refresh();
    }
  };

  const handleBanUser = async (userId: string) => {
    const result = await BanUser(userId);
    if (!result.success) {
      toast.error(result.error || "Failed to ban user");
    } else {
      toast.success("User banned successfully");
      router.refresh();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await DeleteUser(userId);
    if (!result.success) {
      toast.error(result.error || "Failed to delete user");
    } else {
      toast.success("User deleted successfully");
      router.refresh();
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    const result = await RemoveAdminPrivileges(userId);
    if (!result.success) {
      toast.error(result.error || "Failed to remove admin privileges");
    } else {
      toast.success("Admin privileges removed");
      router.refresh();
    }
  };

  const crewTotalPages = Math.ceil(Crew.length / ROWS_PER_PAGE);
  const paginatedCrew = Crew.slice(
    (crewPage - 1) * ROWS_PER_PAGE,
    crewPage * ROWS_PER_PAGE,
  );

  const adminTotalPages = Math.ceil(Admins.length / ROWS_PER_PAGE);
  const paginatedAdmins = Admins.slice(
    (adminPage - 1) * ROWS_PER_PAGE,
    adminPage * ROWS_PER_PAGE,
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

  return (
    <div className="w-full p-6">
      <AdminProfile pageName="User management" />
      <Tabs defaultValue="crew" className="w-full">
        <div className="flex gap-5">
          <TabsList>
            <TabsTrigger value="crew">Crew</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
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
            {isPending && <Spinner className="bg-background" />}
          </div>
        </div>
        <TabsContent value="crew">
          <div className="bg-card rounded-lg border shadow-sm">
            <Table className="">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead onClick={() => console.log("clicked")}>
                    Name
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Crew Form</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCrew.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-accent-foreground text-background">
                            {getInitials(user.firstname, user.lastname)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.firstname} {user.lastname}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-muted-foreground text-sm">
                        {user.email}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm">{formatDate(user.created_at)}</p>
                    </TableCell>

                    <TableCell>
                      {user.formcompleted ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewForm(user.id)}
                          className="gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          View Form
                        </Button>
                      ) : (
                        <p className="text-muted-foreground pl-2">
                          Not Submitted Yet
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: string) =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>{user.role}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kindling">Kindling</SelectItem>
                          <SelectItem value="Kindler">Kindler</SelectItem>
                          <SelectItem value="Flame">Flame</SelectItem>
                          <SelectItem value="Fire-keepers">
                            Fire Keepers
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleMakeAdmin(user.id)}
                            className="gap-2"
                          >
                            <Shield className="h-4 w-4" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="gap-2"
                              >
                                <Ban className="h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Ban this user?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This user will be banned from accessing the
                                  platform. You can unban them later if needed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleBanUser(user.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Ban User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the user account and all
                                  associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {renderPagination(crewPage, crewTotalPages, setCrewPage)}
        </TabsContent>
        <TabsContent value="admin">
          <div className="bg-card rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={admin.avatar_url} />
                          <AvatarFallback className="bg-foreground text-background">
                            {getInitials(admin.firstname, admin.lastname)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {admin.firstname} {admin.lastname}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-muted-foreground text-sm">
                        {admin.email}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm">{formatDate(admin.created_at)}</p>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRemoveAdmin(admin.id)}
                            className="gap-2"
                          >
                            <ShieldOff className="h-4 w-4" />
                            Remove Admin
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the user account and all
                                  associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(admin.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {renderPagination(adminPage, adminTotalPages, setAdminPage)}
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
