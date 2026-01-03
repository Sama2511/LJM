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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import AdminProfile from "./AdminProfile";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar_url?: string;
}

export interface Request {
  id: string;
  event_id: string;
  event_title: string;
  status: string;
  users: User;
}

interface Props {
  requests: Request[];
}

const getInitials = (firstname: string, lastname: string) =>
  `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();

export default function CrewRequestManagementClient({ requests }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredRequests = requests.filter((req) => {
    const fullName = `${req.users.firstname} ${req.users.lastname}`.toLowerCase();
    return (
      fullName.includes(searchInput.toLowerCase()) ||
      req.users.email.toLowerCase().includes(searchInput.toLowerCase()) ||
      req.event_title.toLowerCase().includes(searchInput.toLowerCase())
    );
  });

  return (
    <div className="w-full p-6">
      <AdminProfile pageName="Crew Requests" />

      {/* Search Box */}
      <div className="mb-6 flex items-center gap-2 max-w-md">
        <div className="bg-muted relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by name, email or event..."
            value={searchInput}
            onChange={(e) =>
              startTransition(() => setSearchInput(e.target.value))
            }
            className="pr-9 pl-9"
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchInput("")}
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isPending && <span className="text-muted-foreground text-sm">Searching...</span>}
      </div>

      {/* Requests Table */}
      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={req.users.avatar_url} />
                        <AvatarFallback className="bg-primary text-white">
                          {getInitials(req.users.firstname, req.users.lastname)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium">
                        {req.users.firstname} {req.users.lastname}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{req.users.email}</TableCell>
                  <TableCell>{req.event_title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        req.status === "Approved"
                          ? "default"
                          : req.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No volunteer requests
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
