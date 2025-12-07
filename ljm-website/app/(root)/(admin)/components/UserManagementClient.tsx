"use client";

import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  FileText,
  Shield,
  Ban,
  Trash2,
  ShieldOff,
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
  const [users, setUsers] = useState(Crew);
  const [admins, setAdmins] = useState(Admins);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState<any>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user,
      ),
    );

    const result = await UpdateUserRole(userId, newRole);
    if (!result.success) {
      setUsers(Crew);
      toast.error(result.error || "Failed to update role");
    } else {
      toast.success("Role updated successfully");
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
      // Remove from users list and add to admins
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      const updatedUser = users.find((user) => user.id === userId);
      if (updatedUser) {
        setAdmins((prev) => [...prev, { ...updatedUser, role: "admin" }]);
      }
      toast.success("User promoted to admin");
    }
  };

  const handleBanUser = async (userId: string) => {
    const result = await BanUser(userId);
    if (!result.success) {
      toast.error(result.error || "Failed to ban user");
    } else {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("User banned successfully");
    }
  };

  const handleDeleteUser = async (userId: string, isAdmin: boolean = false) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    const result = await DeleteUser(userId);
    if (!result.success) {
      toast.error(result.error || "Failed to delete user");
    } else {
      if (isAdmin) {
        setAdmins((prev) => prev.filter((admin) => admin.id !== userId));
      } else {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      }
      toast.success("User deleted successfully");
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    const result = await RemoveAdminPrivileges(userId);
    if (!result.success) {
      toast.error(result.error || "Failed to remove admin privileges");
    } else {
      // Remove from admins list and add to users
      setAdmins((prev) => prev.filter((admin) => admin.id !== userId));
      const removedAdmin = admins.find((admin) => admin.id === userId);
      if (removedAdmin) {
        setUsers((prev) => [
          ...prev,
          { ...removedAdmin, role: "kindling", formcompleted: false },
        ]);
      }
      toast.success("Admin privileges removed");
    }
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="font-chillax text-2xl font-semibold md:text-3xl">
          User Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage users and their roles
        </p>
      </div>

      <Tabs defaultValue="crew" className="w-full">
        <TabsList>
          <TabsTrigger value="crew">Crew</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-[#3E5F44] text-white">
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
                          <DropdownMenuItem
                            onClick={() => handleBanUser(user.id)}
                            className="gap-2"
                          >
                            <Ban className="h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user.id, false)}
                            className="text-destructive gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={admin.avatar_url} />
                          <AvatarFallback className="bg-[#3E5F44] text-white">
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
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(admin.id, true)}
                            className="text-destructive gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
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
